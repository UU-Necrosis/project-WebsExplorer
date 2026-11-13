import type { DataSource, EntityManager, Repository } from 'typeorm';
import { AuditService } from './audit.service';
import { AuditLog } from './entities/audit-log.entity';

describe('AuditService', () => {
  it('appends entries to a hash chain and detects tampering', async () => {
    const records: AuditLog[] = [];
    const repository = {
      findOne: jest.fn(async () => records[records.length - 1] ?? null),
      find: jest.fn(async () => [...records].sort((first, second) => Number(first.sequence) - Number(second.sequence))),
      create: jest.fn((value: Partial<AuditLog>) => ({
        ...value,
        sequence: String(records.length + 1),
      })),
      save: jest.fn(async (value: AuditLog) => {
        const index = records.findIndex((record) => record.sequence === value.sequence);
        if (index < 0) records.push(value);
        else records[index] = value;
        return value;
      }),
    };
    const manager = {
      query: jest.fn(),
      getRepository: jest.fn(() => repository),
    };
    const service = new AuditService(
      repository as unknown as Repository<AuditLog>,
      {} as unknown as DataSource,
    );

    await service.record({
      event: 'ADMIN_LOGIN',
      type: 'auth',
      actorId: '4',
      actorName: 'Admin',
      actorRole: 'admin',
      details: { method: 'password' },
    }, manager as unknown as EntityManager);
    await service.record({
      event: 'ADMIN_VOTE_RECORDED',
      type: 'vote',
      actorId: '4',
      actorName: 'Admin',
      actorRole: 'admin',
      targetId: 'submission-id',
      targetName: 'Example',
      details: { votes: 1 },
    }, manager as unknown as EntityManager);

    expect(records).toHaveLength(2);
    expect(records[0].previousHash).toBe('0'.repeat(64));
    expect(records[1].previousHash).toBe(records[0].hash);
    expect(await service.verify()).toMatchObject({ valid: true, checked: 2 });

    records[0].actorName = 'Changed outside the API';
    expect(await service.verify()).toMatchObject({
      valid: false,
      firstInvalidId: '1',
    });
  });
});
