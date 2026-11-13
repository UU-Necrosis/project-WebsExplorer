import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { DataSource, Repository } from 'typeorm';
import { ClusterNode } from './entities/cluster-node.entity';
import { WebsiteSaved } from './entities/website-saved.entity';
import { WebsiteSubmission } from './entities/website-submission.entity';

const ADMIN_VOTE_THRESHOLD = 5;
const CLIENT_VOTE_THRESHOLD = 3;

export interface CreateSubmissionInput {
  name: string;
  url: string;
  submittedBy: string;
  appearance: string;
  description: string;
  categories: string[];
  tags: string[];
  username: string;
  role: string;
}

export type VoteKind = 'admin' | 'client';

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
    private readonly dataSource: DataSource,
  ) {}

  async listSubmissions() {
    const submissions = await this.submissionRepository.find({ order: { submittedAt: 'DESC' } });
    return submissions.map((submission) => this.withQueue(submission));
  }

  async createSubmission(input: CreateSubmissionInput, user?: { id: string; name: string; email: string }) {
    const requiredFields = [input.name, input.url, input.appearance, input.description];
    if (requiredFields.some((value) => typeof value !== 'string' || !value.trim())) {
      throw new BadRequestException('Name, URL, short description, and description are required.');
    }

    const id = randomUUID();
    const compactId = id.replace(/-/g, '');
    const submission = this.submissionRepository.create({
      id,
      name: input.name.trim(),
      url: input.url.trim(),
      submittedBy: user?.name?.trim() || input.submittedBy?.trim() || 'community-member',
      appearance: input.appearance.trim(),
      description: input.description.trim(),
      categories: Array.isArray(input.categories) ? input.categories : [],
      tags: Array.isArray(input.tags) ? input.tags : [],
      username: user?.name?.trim() || input.username?.trim() || 'community-member',
      role: user ? 'Customer' : input.role?.trim() || 'Community',
      hash: `0x${compactId.slice(0, 8)}...${compactId.slice(-4)}`,
      fullHash: compactId,
      submittedAt: new Date(),
      adminVotes: [],
      clientVotes: [],
      status: 'Hidden',
    });

    return this.withQueue(await this.submissionRepository.save(submission));
  }

  async recordVote(id: string, kind: VoteKind, voterId: number) {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(WebsiteSubmission);
      const submission = await repository.findOne({
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!submission) throw new NotFoundException('Submission not found.');

      const votes = kind === 'admin' ? submission.adminVotes : submission.clientVotes;
      const threshold = kind === 'admin' ? ADMIN_VOTE_THRESHOLD : CLIENT_VOTE_THRESHOLD;
      if (kind === 'client' && submission.adminVotes.length < ADMIN_VOTE_THRESHOLD) {
        throw new ConflictException('Client voting opens after the admin vote threshold is reached.');
      }
      if (votes.includes(voterId)) throw new ConflictException('This account has already voted.');
      if (votes.length >= threshold) throw new ConflictException('This vote stage is already complete.');

      if (kind === 'admin') submission.adminVotes = [...votes, voterId];
      else submission.clientVotes = [...votes, voterId];

      const approved = submission.adminVotes.length >= ADMIN_VOTE_THRESHOLD
        && submission.clientVotes.length >= CLIENT_VOTE_THRESHOLD;
      if (approved) submission.status = 'Visible';
      const updated = await repository.save(submission);

      if (approved) {
        const savedRepository = manager.getRepository(WebsiteSaved);
        const existing = await savedRepository.findOneBy({ submissionId: id });
        if (!existing) await savedRepository.save(savedRepository.create({ submissionId: id }));
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
    return { ...submission, queue };
  }
}