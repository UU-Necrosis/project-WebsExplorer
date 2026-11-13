import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createHash } from 'node:crypto';
import { UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { AuditService } from './audit.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const originalTokenSecret = process.env.AUTH_TOKEN_SECRET;
  const originalAdminAccounts = process.env.ADMIN_ACCOUNTS_JSON;
  let authService: AuthService;
  let queryBuilder: {
    where: jest.Mock;
    getMany: jest.Mock;
  };
  let auditRecord: jest.Mock;

  const password = 'secure-pass';
  const hashPassword = (value: string) => createHash('sha256').update(value).digest('hex');
  const user = {
    id: 'user-id',
    name: 'Jane Doe',
    email: 'jane@example.com',
    passwordHash: hashPassword(password),
    createdAt: new Date(),
  };

  beforeEach(async () => {
    process.env.AUTH_TOKEN_SECRET = 'test-secret-with-more-than-32-characters';
    delete process.env.ADMIN_ACCOUNTS_JSON;
    queryBuilder = {
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    };

    const userRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    };
    auditRecord = jest.fn().mockResolvedValue(undefined);

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: AuditService, useValue: { record: auditRecord } },
      ],
    }).compile();

    authService = app.get<AuthService>(AuthService);
  });

  afterEach(() => {
    if (originalTokenSecret === undefined) delete process.env.AUTH_TOKEN_SECRET;
    else process.env.AUTH_TOKEN_SECRET = originalTokenSecret;
    if (originalAdminAccounts === undefined) delete process.env.ADMIN_ACCOUNTS_JSON;
    else process.env.ADMIN_ACCOUNTS_JSON = originalAdminAccounts;
  });

  it('logs in using a case-insensitive name', async () => {
    queryBuilder.getMany.mockResolvedValue([user]);

    const result = await authService.login({ identifier: '  JANE DOE ', password });

    expect(queryBuilder.where).toHaveBeenCalledWith(
      'LOWER(user.email) = :identifier OR LOWER(user.name) = :identifier',
      { identifier: 'jane doe' },
    );
    expect(result.user).toEqual({ id: user.id, name: user.name, email: user.email });
  });

  it('continues to support email-based login', async () => {
    queryBuilder.getMany.mockResolvedValue([user]);

    const result = await authService.login({ email: 'JANE@EXAMPLE.COM', password });

    expect(result.user.email).toBe(user.email);
  });

  it('rejects ambiguous duplicate names instead of selecting the wrong account', async () => {
    queryBuilder.getMany.mockResolvedValue([
      user,
      { ...user, id: 'another-user', email: 'another@example.com' },
    ]);

    await expect(authService.login({ identifier: user.name, password }))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('creates and resolves an admin-only token from configured credentials', async () => {
    process.env.ADMIN_ACCOUNTS_JSON = JSON.stringify([{
      id: 8,
      name: 'Site Admin',
      email: 'admin@example.com',
      passwordHash: hashPassword(password),
    }]);

    const result = await authService.loginAdmin({ identifier: 'SITE ADMIN', password });

    expect(result.accountId).toBe(8);
    expect(authService.resolveAdminFromHeader(`Bearer ${result.token}`)).toMatchObject({
      id: '8',
      adminId: 8,
      role: 'admin',
    });
    expect(auditRecord).toHaveBeenCalledWith(expect.objectContaining({
      event: 'ADMIN_LOGIN',
      actorId: '8',
      actorRole: 'admin',
    }));
  });
});
