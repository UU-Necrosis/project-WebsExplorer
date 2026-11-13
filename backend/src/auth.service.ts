import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID, createHash } from 'node:crypto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

export interface AuthUserPayload {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  private readonly tokenMap = new Map<string, AuthUserPayload>();

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
    const token = randomUUID();
    this.tokenMap.set(token, user);
    return token;
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
    const payload = { id: saved.id, name: saved.name, email: saved.email };

    return {
      token: this.createToken(payload),
      user: payload,
    };
  }

  async login(input: { email?: string; password?: string }) {
    const email = this.normalizeEmail(input.email ?? '');
    const password = input.password ?? '';
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || user.passwordHash !== this.hashPassword(password)) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const payload = { id: user.id, name: user.name, email: user.email };
    return {
      token: this.createToken(payload),
      user: payload,
    };
  }

  resolveFromHeader(authorization?: string): AuthUserPayload {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token.');
    }

    const token = authorization.replace(/^Bearer\s+/i, '').trim();
    const user = this.tokenMap.get(token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired session token.');
    }
    return user;
  }
}
