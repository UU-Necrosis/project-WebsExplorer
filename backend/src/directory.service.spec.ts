import { ConflictException, HttpException } from '@nestjs/common';
import type { DataSource, Repository } from 'typeorm';
import { ClusterNode } from './entities/cluster-node.entity';
import { User } from './entities/user.entity';
import { WebsiteSaved } from './entities/website-saved.entity';
import { WebsiteSubmission } from './entities/website-submission.entity';
import { DirectoryService } from './directory.service';

describe('DirectoryService submission review workflow', () => {
  const createSubmission = (overrides: Partial<WebsiteSubmission> = {}) => ({
    id: 'submission-id',
    name: 'Example',
    hash: '0xhash',
    fullHash: 'fullhash',
    submittedBy: 'Owner',
    submitterId: 'owner-id',
    canonicalUrl: 'https://example.com/',
    submittedAt: new Date(),
    adminVotes: [] as (number | string)[],
    clientVotes: [] as (number | string)[],
    url: 'https://example.com',
    status: 'Hidden' as const,
    appearance: 'Example site',
    description: 'A useful website.',
    categories: ['Tools'],
    tags: [],
    username: 'Owner',
    role: 'Community',
    relationship: 'user' as const,
    contactEmail: null,
    rating: 5,
    logoInitials: '',
    ownershipAuthorized: false,
    canVerifyConnection: false,
    ...overrides,
  });

  const createService = (options?: {
    transactionalSubmission?: Record<string, jest.Mock>;
    transactionalUser?: Record<string, jest.Mock>;
    transactionalSaved?: Record<string, jest.Mock>;
  }) => {
    const submissionRepository = options?.transactionalSubmission ?? {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };
    const userRepository = options?.transactionalUser ?? {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
    };
    const savedRepository = options?.transactionalSaved ?? {
      findOneBy: jest.fn(),
      create: jest.fn((value) => value),
      save: jest.fn((value) => Promise.resolve(value)),
    };
    const manager = {
      query: jest.fn(),
      getRepository: jest.fn((entity: typeof User | typeof WebsiteSubmission | typeof WebsiteSaved) => {
        if (entity === User) return userRepository;
        if (entity === WebsiteSaved) return savedRepository;
        return submissionRepository;
      }),
    };
    const dataSource = {
      transaction: jest.fn((callback: (transactionManager: typeof manager) => Promise<unknown>) => callback(manager)),
    };
    const service = new DirectoryService(
      {} as unknown as Repository<WebsiteSubmission>,
      {} as unknown as Repository<WebsiteSaved>,
      {} as unknown as Repository<ClusterNode>,
      userRepository as unknown as Repository<User>,
      dataSource as unknown as DataSource,
    );

    return { service, manager, submissionRepository, userRepository, savedRepository };
  };

  it('merges a duplicate URL and credits a new customer vote', async () => {
    const existing = createSubmission();
    const transactionRepository = {
      findOne: jest.fn().mockResolvedValue(existing),
      find: jest.fn(),
      save: jest.fn(async (value: typeof existing) => value),
    };
    const { service } = createService({ transactionalSubmission: transactionRepository });

    const result = await service.createSubmission({
      name: 'Example',
      url: 'https://www.example.com/',
      appearance: 'Example site',
      description: 'A useful website.',
      categories: ['Tools'],
    }, {
      id: 'customer-id',
      name: 'Customer',
      email: 'customer@example.com',
      role: 'customer',
    });

    expect(result).toMatchObject({ duplicate: true, voteAdded: true });
    expect(result.message).toContain('customer vote was added');
    expect(existing.clientVotes).toEqual(['customer-id']);
    expect(transactionRepository.save).toHaveBeenCalledTimes(1);
  });

  it('rejects a new customer URL during the seven-day cooldown', async () => {
    const transactionRepository = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      save: jest.fn(),
    };
    const transactionUserRepository = {
      findOne: jest.fn().mockResolvedValue({
        id: 'customer-id',
        lastSubmissionAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      }),
      findOneBy: jest.fn(),
      save: jest.fn(),
    };
    const { service } = createService({
      transactionalSubmission: transactionRepository,
      transactionalUser: transactionUserRepository,
    });

    const rejection = await service.createSubmission({
      name: 'Another site',
      url: 'https://another-example.com',
      appearance: 'Another site',
      description: 'Another useful website.',
      categories: ['Tools'],
    }, {
      id: 'customer-id',
      name: 'Customer',
      email: 'customer@example.com',
      role: 'customer',
    }).then(() => null, (error: unknown) => error);
    expect(rejection).toBeInstanceOf(HttpException);
    expect(rejection instanceof HttpException ? rejection.getStatus() : null).toBe(429);
    expect(transactionRepository.save).not.toHaveBeenCalled();
  });

  it('exempts admins from the customer submission cooldown', async () => {
    const { service } = createService();

    await expect(service.getSubmissionCooldown({
      id: 'admin-id',
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
      adminId: 1,
    })).resolves.toEqual({ canSubmit: true, adminBypass: true, availableAt: null });
  });

  it('requires five admin votes before customer voting and approves at three customer votes', async () => {
    const underReview = createSubmission({
      adminVotes: [1, 2, 3, 4, 5],
      clientVotes: ['customer-1', 'customer-2'],
    });
    const transactionRepository = {
      findOne: jest.fn().mockResolvedValue(underReview),
      save: jest.fn(async (value) => value),
    };
    const transactionSavedRepository = {
      findOneBy: jest.fn().mockResolvedValue(null),
      create: jest.fn((value: unknown) => value),
      save: jest.fn((value: unknown) => Promise.resolve(value)),
    };
    const { service } = createService({
      transactionalSubmission: transactionRepository,
      transactionalSaved: transactionSavedRepository,
    });

    await expect(service.recordVote('submission-id', 'client', 'customer-3'))
      .resolves.toMatchObject({ queue: 'approved', status: 'Visible' });
    expect(underReview.clientVotes).toEqual(['customer-1', 'customer-2', 'customer-3']);
    expect(transactionSavedRepository.save).toHaveBeenCalledTimes(1);
  });

  it('rejects customer votes before the admin stage is complete', async () => {
    const pending = createSubmission({ adminVotes: [1, 2, 3, 4] });
    const transactionRepository = {
      findOne: jest.fn().mockResolvedValue(pending),
      save: jest.fn(),
    };
    const { service } = createService({ transactionalSubmission: transactionRepository });

    await expect(service.recordVote('submission-id', 'client', 'customer-id'))
      .rejects.toBeInstanceOf(ConflictException);
    expect(transactionRepository.save).not.toHaveBeenCalled();
  });
});
