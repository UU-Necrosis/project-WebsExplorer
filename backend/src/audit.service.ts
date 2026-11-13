import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'node:crypto';
import { DataSource, EntityManager, FindManyOptions, Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

const GENESIS_HASH = '0'.repeat(64);
const DEFAULT_AUDIT_LIMIT = 200;
const MAX_AUDIT_LIMIT = 500;

export interface AuditEventInput {
  event: string;
  type: string;
  actorId?: string | null;
  actorName: string;
  actorRole: 'admin' | 'customer' | 'system';
  targetId?: string | null;
  targetName?: string | null;
  details?: Record<string, unknown>;
}

export interface AdminAuditLog {
  id: string;
  event: string;
  type: string;
  actorId: string | null;
  actor: string;
  actorRole: string;
  targetId: string | null;
  target: string | null;
  details: Record<string, unknown>;
  time: string;
  previousHash: string;
  hash: string;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
    private readonly dataSource: DataSource,
  ) {}

  async record(event: AuditEventInput, manager?: EntityManager) {
    if (manager) return this.append(manager, event);
    return this.dataSource.transaction((transactionManager) => this.append(transactionManager, event));
  }

  async list(limit?: string, type?: string): Promise<AdminAuditLog[]> {
    const requestedLimit = Number(limit);
    const take = Number.isInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, MAX_AUDIT_LIMIT)
      : DEFAULT_AUDIT_LIMIT;
    const options: FindManyOptions<AuditLog> = {
      order: { sequence: 'DESC' },
      take,
    };
    if (type && type !== 'all') options.where = { type };

    const records = await this.auditRepository.find(options);
    return records.map((record) => this.toResponse(record));
  }

  async verify() {
    const records = await this.auditRepository.find({ order: { sequence: 'ASC' } });
    let expectedPreviousHash = GENESIS_HASH;

    for (const [index, record] of records.entries()) {
      if (record.previousHash !== expectedPreviousHash || record.hash !== this.calculateHash(record)) {
        return {
          valid: false,
          checked: index,
          firstInvalidId: String(record.sequence),
          headHash: expectedPreviousHash,
        };
      }
      expectedPreviousHash = record.hash;
    }

    return {
      valid: true,
      checked: records.length,
      firstInvalidId: null,
      headHash: expectedPreviousHash,
    };
  }

  private async append(manager: EntityManager, event: AuditEventInput) {
    await manager.query('SELECT pg_advisory_xact_lock(hashtext($1))', ['admin-audit-log-chain']);
    const repository = manager.getRepository(AuditLog);
    const previous = await repository.findOne({ order: { sequence: 'DESC' } });
    const entry = repository.create({
      event: event.event,
      type: event.type,
      actorId: event.actorId ?? null,
      actorName: event.actorName,
      actorRole: event.actorRole,
      targetId: event.targetId ?? null,
      targetName: event.targetName ?? null,
      details: event.details ?? {},
      createdAt: new Date(),
      previousHash: previous?.hash ?? GENESIS_HASH,
      hash: GENESIS_HASH,
    });

    const inserted = await repository.save(entry);
    inserted.hash = this.calculateHash(inserted);
    return repository.save(inserted);
  }

  private calculateHash(record: AuditLog) {
    const payload = {
      sequence: String(record.sequence),
      event: record.event,
      type: record.type,
      actorId: record.actorId,
      actorName: record.actorName,
      actorRole: record.actorRole,
      targetId: record.targetId,
      targetName: record.targetName,
      details: this.sortObjectKeys(record.details),
      createdAt: record.createdAt.toISOString(),
      previousHash: record.previousHash,
    };
    return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  }

  private sortObjectKeys(value: unknown): unknown {
    if (Array.isArray(value)) return value.map((item) => this.sortObjectKeys(item));
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).sort(([first], [second]) => first.localeCompare(second))
          .map(([key, item]) => [key, this.sortObjectKeys(item)]),
      );
    }
    return value;
  }

  private toResponse(record: AuditLog): AdminAuditLog {
    return {
      id: String(record.sequence),
      event: record.event,
      type: record.type,
      actorId: record.actorId,
      actor: record.actorName,
      actorRole: record.actorRole,
      targetId: record.targetId,
      target: record.targetName,
      details: record.details,
      time: record.createdAt.toISOString(),
      previousHash: record.previousHash,
      hash: record.hash,
    };
  }
}
