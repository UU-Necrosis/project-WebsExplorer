import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

export interface AuthUserPayload {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  adminId?: number;
}

interface AdminAccountConfig {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
}

@Injectable()
export class AuthService {
  private readonly sessionDurationMs = 7 * 24 * 60 * 60 * 1000;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private hashPassword(password: string) {
    return createHash('sha256').update(password).digest('hex');
  }

  private createToken(user: AuthUserPayload) {
    const payload = Buffer.from(JSON.stringify({
      ...user,
      expiresAt: Date.now() + this.sessionDurationMs,
    })).toString('base64url');
    const signature = createHmac('sha256', this.getTokenSecret()).update(payload).digest('base64url');
    return `${payload}.${signature}`;
  }

  private getTokenSecret() {
    const secret = process.env.AUTH_TOKEN_SECRET?.trim();
    if (!secret || secret.length < 32) {
      throw new InternalServerErrorException('AUTH_TOKEN_SECRET must be configured with at least 32 characters.');
    }
    return secret;
  }

  private getAdminAccounts(): AdminAccountConfig[] {
    const configuredAccounts = process.env.ADMIN_ACCOUNTS_JSON?.trim();
    if (!configuredAccounts) throw new InternalServerErrorException('Admin login is not configured.');

    let parsed: unknown;
    try {
      parsed = JSON.parse(configuredAccounts);
    } catch {
      throw new InternalServerErrorException('ADMIN_ACCOUNTS_JSON must contain a valid account list.');
    }
    if (!Array.isArray(parsed)) {
      throw new InternalServerErrorException('ADMIN_ACCOUNTS_JSON must contain a valid account list.');
    }

    const accounts = parsed as Partial<AdminAccountConfig>[];
    const valid = accounts.every((account) =>
      Number.isInteger(account.id)
      && Number(account.id) > 0
      && typeof account.name === 'string'
      && !!account.name.trim()
      && typeof account.email === 'string'
      && !!account.email.trim()
      && typeof account.passwordHash === 'string'
      && /^[a-f\d]{64}$/i.test(account.passwordHash)
    );
    if (!valid) {
      throw new InternalServerErrorException('ADMIN_ACCOUNTS_JSON contains an invalid account record.');
    }

    const ids = accounts.map((account) => account.id);
    const emails = accounts.map((account) => account.email?.trim().toLowerCase());
    if (new Set(ids).size !== ids.length || new Set(emails).size !== emails.length) {
      throw new InternalServerErrorException('Admin account IDs and email addresses must be unique.');
    }
    return accounts as AdminAccountConfig[];
  }

  async signup(input: { name?: string; email?: string; password?: string }) {
    const name = input.name?.trim();
    const email = this.normalizeEmail(input.email ?? '');
    const password = input.password ?? '';

    if (!name || !email || !password || password.length < 6) {
      throw new UnauthorizedException('Name, a valid email, and a password of at least 6 characters are required.');
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('A customer with this email already exists.');
    }

    const user = this.userRepository.create({
      id: randomUUID(),
      name,
      email,
      passwordHash: this.hashPassword(password),
    });

    const saved = await this.userRepository.save(user);
    const payload: AuthUserPayload = {
      id: saved.id,
      name: saved.name,
      email: saved.email,
      role: 'customer',
    };

    return {
      token: this.createToken(payload),
      user: { id: payload.id, name: payload.name, email: payload.email },
    };
  }

  async login(input: { identifier?: string; email?: string; password?: string }) {
    const identifier = this.normalizeEmail(input.identifier?.trim() || input.email || '');
    const password = input.password ?? '';
    if (!identifier || !password) {
      throw new UnauthorizedException('Invalid name/email or password.');
    }

    const candidates = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = :identifier OR LOWER(user.name) = :identifier', { identifier })
      .getMany();
    const matchingUsers = candidates.filter(
      (candidate) => candidate.passwordHash === this.hashPassword(password),
    );

    if (matchingUsers.length !== 1) {
      throw new UnauthorizedException('Invalid name/email or password.');
    }

    const user = matchingUsers[0];
    const payload: AuthUserPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'customer',
    };
    return {
      token: this.createToken(payload),
      user: { id: payload.id, name: payload.name, email: payload.email },
    };
  }

  loginAdmin(input: { identifier?: string; email?: string; password?: string }) {
    const identifier = this.normalizeEmail(input.identifier?.trim() || input.email || '');
    const password = input.password ?? '';
    if (!identifier || !password) throw new UnauthorizedException('Invalid admin name/email or password.');

    const matches = this.getAdminAccounts().filter((account) =>
      account.email.trim().toLowerCase() === identifier
      || account.name.trim().toLowerCase() === identifier
    );
    if (matches.length !== 1 || matches[0].passwordHash.toLowerCase() !== this.hashPassword(password)) {
      throw new UnauthorizedException('Invalid admin name/email or password.');
    }

    const account = matches[0];
    const payload: AuthUserPayload = {
      id: String(account.id),
      adminId: account.id,
      name: account.name,
      email: account.email,
      role: 'admin',
    };
    return {
      token: this.createToken(payload),
      accountId: account.id,
      user: { id: payload.id, name: payload.name, email: payload.email },
    };
  }

  resolveFromHeader(authorization?: string): AuthUserPayload {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token.');
    }

    const token = authorization.replace(/^Bearer\s+/i, '').trim();
    const [payload, encodedSignature, ...extra] = token.split('.');
    if (!payload || !encodedSignature || extra.length > 0) {
      throw new UnauthorizedException('Invalid or expired session token.');
    }

    const expectedSignature = createHmac('sha256', this.getTokenSecret()).update(payload).digest();
    const providedSignature = Buffer.from(encodedSignature, 'base64url');
    if (providedSignature.length !== expectedSignature.length
      || !timingSafeEqual(providedSignature, expectedSignature)) {
      throw new UnauthorizedException('Invalid or expired session token.');
    }

    let user: AuthUserPayload & { expiresAt?: number };
    try {
      user = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AuthUserPayload & { expiresAt?: number };
    } catch {
      throw new UnauthorizedException('Invalid or expired session token.');
    }
    if (!user.id || !user.name || !user.email || !['customer', 'admin'].includes(user.role)
      || !Number.isFinite(user.expiresAt) || (user.expiresAt ?? 0) <= Date.now()) {
      throw new UnauthorizedException('Invalid or expired session token.');
    }
    return user;
  }

  resolveCustomerFromHeader(authorization?: string) {
    const user = this.resolveFromHeader(authorization);
    if (user.role !== 'customer') throw new UnauthorizedException('A customer session is required.');
    return user;
  }

  resolveAdminFromHeader(authorization?: string): AuthUserPayload & { adminId: number } {
    const user = this.resolveFromHeader(authorization);
    if (user.role !== 'admin' || !user.adminId) {
      throw new UnauthorizedException('An admin session is required.');
    }
    return user as AuthUserPayload & { adminId: number };
  }
}
