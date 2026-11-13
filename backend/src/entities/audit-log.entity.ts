import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'audit_logs' })
export class AuditLog {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  sequence: string;

  @Column({ type: 'varchar', length: 120 })
  event: string;

  @Column({ type: 'varchar', length: 24 })
  type: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  actorId: string | null;

  @Column({ type: 'varchar', length: 255 })
  actorName: string;

  @Column({ type: 'varchar', length: 16 })
  actorRole: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  targetId: string | null;

  @Column({ type: 'varchar', length: 180, nullable: true })
  targetName: string | null;

  @Column({ type: 'jsonb' })
  details: Record<string, unknown>;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 64 })
  previousHash: string;

  @Column({ type: 'varchar', length: 64 })
  hash: string;
}
