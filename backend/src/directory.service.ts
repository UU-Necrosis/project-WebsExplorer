import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { DataSource, EntityManager, IsNull, Repository } from 'typeorm';
import { AuditService } from './audit.service';
import { ClusterNode } from './entities/cluster-node.entity';
import { User } from './entities/user.entity';
import { WebsiteSaved } from './entities/website-saved.entity';
import { WebsiteSubmission } from './entities/website-submission.entity';

const ADMIN_VOTE_THRESHOLD = 5;
const CLIENT_VOTE_THRESHOLD = 3;
const SUBMISSION_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

export interface SubmissionActor {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  adminId?: number;
}

export interface SubmissionCooldown {
  canSubmit: boolean;
  adminBypass: boolean;
  availableAt: string | null;
}

export interface CreateSubmissionInput {
  name: string;
  url: string;
  appearance: string;
  description: string;
  categories?: string[];
  tags?: string[];
  relationship?: 'user' | 'creator' | 'curator';
  contactEmail?: string | null;
  rating?: number | null;
  logoInitials?: string;
  ownershipAuthorized?: boolean;
  canVerifyConnection?: boolean;
}

export interface NodeHeartbeatInput {
  id: string;
  name: string;
  region: string;
  latencyMs: number | null;
  status: 'online' | 'offline' | 'maintenance';
}

@Injectable()
export class DirectoryService {
  constructor(
    @InjectRepository(WebsiteSubmission)
    private readonly submissionRepository: Repository<WebsiteSubmission>,
    @InjectRepository(WebsiteSaved)
    private readonly savedRepository: Repository<WebsiteSaved>,
    @InjectRepository(ClusterNode)
    private readonly nodeRepository: Repository<ClusterNode>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly auditService: AuditService,
  ) {}

  async listSubmissions() {
    const submissions = await this.submissionRepository.find({ order: { submittedAt: 'DESC' } });
    return submissions.map((submission) => this.withQueue(submission));
  }

  async listSubmissionsForUser(userId: string) {
    const submissions = await this.submissionRepository.find({
      where: { submitterId: userId },
      order: { submittedAt: 'DESC' },
    });
    return submissions.map((submission) => this.withQueue(submission));
  }

  async listSubmissionsForClientVoting(userId: string) {
    const submissions = await this.submissionRepository.find({ order: { submittedAt: 'DESC' } });
    return submissions
      .filter((submission) =>
        submission.adminVotes.length >= ADMIN_VOTE_THRESHOLD
        && submission.clientVotes.length < CLIENT_VOTE_THRESHOLD
        && !submission.clientVotes.some((voterId) => String(voterId) === userId)
        && submission.submitterId !== userId
      )
      .map((submission) => this.withQueue(submission));
  }

  async getSubmissionCooldown(user: SubmissionActor): Promise<SubmissionCooldown> {
    if (user.role === 'admin') return { canSubmit: true, adminBypass: true, availableAt: null };
    const account = await this.userRepository.findOneBy({ id: user.id });
    if (!account) throw new UnauthorizedException('Customer account no longer exists.');
    const latestSubmission = await this.submissionRepository.findOne({
      where: { submitterId: user.id },
      order: { submittedAt: 'DESC' },
    });
    const lastSubmissionAt = this.latestDate(account.lastSubmissionAt, latestSubmission?.submittedAt ?? null);
    const availableAt = lastSubmissionAt ? new Date(lastSubmissionAt.getTime() + SUBMISSION_COOLDOWN_MS) : null;
    return {
      canSubmit: !availableAt || availableAt.getTime() <= Date.now(),
      adminBypass: false,
      availableAt: availableAt?.toISOString() ?? null,
    };
  }

  async createSubmission(input: CreateSubmissionInput, user: SubmissionActor) {
    const requiredFields = [input.name, input.url, input.appearance, input.description];
    if (requiredFields.some((value) => typeof value !== 'string' || !value.trim())) {
      throw new BadRequestException('Name, URL, short description, and description are required.');
    }
    if (input.rating != null && (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5)) {
      throw new BadRequestException('Rating must be a whole number from 1 to 5.');
    }
    const relationship = input.relationship ?? 'curator';
    if (!['user', 'creator', 'curator'].includes(relationship)) {
      throw new BadRequestException('Choose a valid relationship to this website.');
    }
    if (relationship === 'creator' && (!input.contactEmail?.trim() || !input.ownershipAuthorized || !input.canVerifyConnection)) {
      throw new BadRequestException('Creators must provide contact details and confirm ownership verification.');
    }
    const categories = input.categories;
    const tags = input.tags ?? [];
    if (!Array.isArray(categories) || categories.length === 0 || !Array.isArray(tags)) {
      throw new BadRequestException('Select at least one website category.');
    }
    if (categories.some((category) => typeof category !== 'string' || !category.trim())
      || tags.some((tag) => typeof tag !== 'string' || !tag.trim())) {
      throw new BadRequestException('Categories and tags must be non-empty text values.');
    }
    if (input.name.trim().length > 180 || input.url.trim().length > 2048 || input.appearance.trim().length > 255) {
      throw new BadRequestException('Website name, URL, or short description exceeds the allowed length.');
    }
    if (input.logoInitials && input.logoInitials.trim().length > 16) {
      throw new BadRequestException('Logo initials must be 16 characters or fewer.');
    }
    const canonicalUrl = this.canonicalizeUrl(input.url);

    if (user.role === 'admin' && !user.adminId) {
      throw new UnauthorizedException('A valid admin identity is required to submit websites.');
    }

    return this.dataSource.transaction(async (manager) => {
      await manager.query('SELECT pg_advisory_xact_lock(hashtext($1))', [canonicalUrl]);
      const repository = manager.getRepository(WebsiteSubmission);
      let existing = await repository.findOne({ where: { canonicalUrl }, lock: { mode: 'pessimistic_write' } });
      if (!existing) {
        const legacySubmissions = await repository.find({ where: { canonicalUrl: IsNull() } });
        existing = legacySubmissions.find((submission) => this.canonicalizeUrl(submission.url) === canonicalUrl) ?? null;
      }

      if (existing) {
        const previousStatus = existing.status;
        const voteAdded = this.addRoleVote(existing, user);
        if (!voteAdded) {
          await this.auditService.record({
            event: 'DUPLICATE_SUBMISSION_ATTEMPT',
            type: 'add',
            actorId: user.id,
            actorName: user.name,
            actorRole: user.role,
            targetId: existing.id,
            targetName: existing.name,
            details: { voteAdded: false },
          }, manager);
          return {
            ...this.withQueue(existing),
            duplicate: true,
            voteAdded: false,
            message: 'This website is already in progress; your account has already contributed its vote.',
          };
        }

        this.updateApprovalStatus(existing);
        const updated = await repository.save(existing);
        if (updated.status === 'Visible') await this.ensureSavedWebsite(manager, updated.id);
        await this.auditService.record({
          event: 'DUPLICATE_SUBMISSION_VOTE_ADDED',
          type: 'vote',
          actorId: user.id,
          actorName: user.name,
          actorRole: user.role,
          targetId: updated.id,
          targetName: updated.name,
          details: { adminVotes: updated.adminVotes.length, customerVotes: updated.clientVotes.length },
        }, manager);
        if (previousStatus !== 'Visible' && updated.status === 'Visible') {
          await this.auditService.record({
            event: 'WEBSITE_APPROVED',
            type: 'approve',
            actorId: 'system',
            actorName: 'System',
            actorRole: 'system',
            targetId: updated.id,
            targetName: updated.name,
            details: { adminVotes: updated.adminVotes.length, customerVotes: updated.clientVotes.length },
          }, manager);
        }
        return {
          ...this.withQueue(updated),
          duplicate: true,
          voteAdded: true,
          message: `This website is already in progress. Your ${user.role} vote was added to the existing submission.`,
        };
      }

      const now = new Date();
      if (user.role === 'customer') {
        const accountRepository = manager.getRepository(User);
        const account = await accountRepository.findOne({
          where: { id: user.id },
          lock: { mode: 'pessimistic_write' },
        });
        if (!account) throw new UnauthorizedException('Customer account no longer exists.');

        const latestSubmission = await repository.findOne({
          where: { submitterId: user.id },
          order: { submittedAt: 'DESC' },
        });
        const lastSubmissionAt = this.latestDate(account.lastSubmissionAt, latestSubmission?.submittedAt ?? null);
        const availableAt = lastSubmissionAt
          ? new Date(lastSubmissionAt.getTime() + SUBMISSION_COOLDOWN_MS)
          : null;
        if (availableAt && availableAt.getTime() > now.getTime()) {
          throw new HttpException({
            message: 'You can submit another new website after your seven-day submission cooldown.',
            availableAt: availableAt.toISOString(),
          }, HttpStatus.TOO_MANY_REQUESTS);
        }
        account.lastSubmissionAt = now;
        await accountRepository.save(account);
      }

      const id = randomUUID();
      const compactId = id.replace(/-/g, '');
      const submission = repository.create({
        id,
        name: input.name.trim(),
        url: input.url.trim(),
        canonicalUrl,
        submittedBy: user.name,
        submitterId: user.id,
        appearance: input.appearance.trim(),
        description: input.description.trim(),
        categories: categories.map((category) => category.trim()),
        tags: tags.map((tag) => tag.trim()),
        username: user.name,
        role: user.role === 'admin' ? 'Admin' : relationship === 'creator' ? 'Owner' : 'Community',
        relationship,
        contactEmail: input.contactEmail?.trim() || null,
        rating: input.rating ?? null,
        logoInitials: input.logoInitials?.trim().slice(0, 16) || '',
        ownershipAuthorized: input.ownershipAuthorized ?? false,
        canVerifyConnection: input.canVerifyConnection ?? false,
        hash: `0x${compactId.slice(0, 8)}...${compactId.slice(-4)}`,
        fullHash: compactId,
        submittedAt: now,
        adminVotes: user.role === 'admin' ? [user.adminId!] : [],
        clientVotes: user.role === 'customer' ? [user.id] : [],
        status: 'Hidden',
      });

      const saved = await repository.save(submission);
      await this.auditService.record({
        event: 'SUBMISSION_CREATED',
        type: 'add',
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        targetId: saved.id,
        targetName: saved.name,
        details: { url: saved.url, categories: saved.categories },
      }, manager);
      return {
        ...this.withQueue(saved),
        duplicate: false,
        voteAdded: true,
        message: 'Submission saved and added to the admin review queue.',
      };
    });
  }

  async recordVote(id: string, actor: SubmissionActor) {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(WebsiteSubmission);
      const submission = await repository.findOne({
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!submission) throw new NotFoundException('Submission not found.');

      const kind = actor.role === 'admin' ? 'admin' : 'client';
      const voterId = kind === 'admin' ? actor.adminId : actor.id;
      if (voterId == null || voterId === '') {
        throw new UnauthorizedException('A valid voting identity is required.');
      }
      const votes = kind === 'admin' ? submission.adminVotes : submission.clientVotes;
      const threshold = kind === 'admin' ? ADMIN_VOTE_THRESHOLD : CLIENT_VOTE_THRESHOLD;
      if (kind === 'client' && submission.adminVotes.length < ADMIN_VOTE_THRESHOLD) {
        throw new ConflictException('Client voting opens after the admin vote threshold is reached.');
      }
      if (kind === 'client' && submission.submitterId === voterId) {
        throw new ConflictException('You cannot vote on your own submission.');
      }
      if (votes.some((existingVoterId) => String(existingVoterId) === String(voterId))) {
        throw new ConflictException('This account has already voted.');
      }
      if (votes.length >= threshold) throw new ConflictException('This vote stage is already complete.');

      const previousStatus = submission.status;
      if (kind === 'admin') submission.adminVotes = [...votes, voterId];
      else submission.clientVotes = [...votes, voterId];

      this.updateApprovalStatus(submission);
      const updated = await repository.save(submission);

      if (updated.status === 'Visible') await this.ensureSavedWebsite(manager, id);
      await this.auditService.record({
        event: kind === 'admin' ? 'ADMIN_VOTE_RECORDED' : 'CUSTOMER_VOTE_RECORDED',
        type: 'vote',
        actorId: String(voterId),
        actorName: actor.name,
        actorRole: actor.role,
        targetId: updated.id,
        targetName: updated.name,
        details: { adminVotes: updated.adminVotes.length, customerVotes: updated.clientVotes.length },
      }, manager);
      if (previousStatus !== 'Visible' && updated.status === 'Visible') {
        await this.auditService.record({
          event: 'WEBSITE_APPROVED',
          type: 'approve',
          actorId: 'system',
          actorName: 'System',
          actorRole: 'system',
          targetId: updated.id,
          targetName: updated.name,
          details: { adminVotes: updated.adminVotes.length, customerVotes: updated.clientVotes.length },
        }, manager);
      }

      return this.withQueue(updated);
    });
  }

  async listWebsitesSaved() {
    const saved = await this.savedRepository.find({
      relations: { submission: true },
      order: { savedAt: 'DESC' },
    });
    return saved.map(({ submission }) => this.withQueue(submission));
  }

  listNodes() {
    return this.nodeRepository.find({ order: { name: 'ASC' } });
  }

  async registerNode(input: NodeHeartbeatInput) {
    if (!input.id?.trim() || !input.name?.trim() || !input.region?.trim()) {
      throw new BadRequestException('Node id, name, and region are required.');
    }
    if (!['online', 'offline', 'maintenance'].includes(input.status)) {
      throw new BadRequestException('Node status must be online, offline, or maintenance.');
    }
    if (input.latencyMs !== null && (!Number.isInteger(input.latencyMs) || input.latencyMs < 0)) {
      throw new BadRequestException('Node latency must be a non-negative integer or null.');
    }

    return this.nodeRepository.save(this.nodeRepository.create({
      id: input.id.trim(),
      name: input.name.trim(),
      region: input.region.trim(),
      latencyMs: input.latencyMs,
      status: input.status,
    }));
  }

  private withQueue(submission: WebsiteSubmission) {
    const approved = submission.adminVotes.length >= ADMIN_VOTE_THRESHOLD
      && submission.clientVotes.length >= CLIENT_VOTE_THRESHOLD;
    const queue = approved
      ? 'approved'
      : submission.adminVotes.length >= ADMIN_VOTE_THRESHOLD ? 'audit' : 'pending';
    const { submitterId: _submitterId, canonicalUrl: _canonicalUrl, ...record } = submission;
    return { ...record, queue };
  }

  private canonicalizeUrl(value: string) {
    let url: URL;
    try {
      url = new URL(value.trim());
    } catch {
      throw new BadRequestException('Enter a valid website URL.');
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new BadRequestException('Website URL must use HTTP or HTTPS.');
    }
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    url.hash = '';
    if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, '');
    return url.toString();
  }

  private addRoleVote(submission: WebsiteSubmission, user: SubmissionActor) {
    if (user.role === 'admin') {
      if (!user.adminId) throw new UnauthorizedException('A valid admin identity is required to vote.');
      if (submission.adminVotes.some((id) => String(id) === String(user.adminId))) return false;
      if (submission.adminVotes.length >= ADMIN_VOTE_THRESHOLD) return false;
      submission.adminVotes = [...submission.adminVotes, user.adminId];
    } else {
      if (submission.submitterId === user.id
        || submission.clientVotes.some((id) => String(id) === user.id)
        || submission.clientVotes.length >= CLIENT_VOTE_THRESHOLD) return false;
      submission.clientVotes = [...submission.clientVotes, user.id];
    }
    this.updateApprovalStatus(submission);
    return true;
  }

  private updateApprovalStatus(submission: WebsiteSubmission) {
    if (submission.adminVotes.length >= ADMIN_VOTE_THRESHOLD
      && submission.clientVotes.length >= CLIENT_VOTE_THRESHOLD) {
      submission.status = 'Visible';
    }
  }

  private async ensureSavedWebsite(manager: EntityManager, submissionId: string) {
    const repository = manager.getRepository(WebsiteSaved);
    const existing = await repository.findOneBy({ submissionId });
    if (!existing) await repository.save(repository.create({ submissionId }));
  }

  private latestDate(first: Date | null, second: Date | null) {
    if (!first) return second;
    if (!second) return first;
    return first.getTime() >= second.getTime() ? first : second;
  }
}