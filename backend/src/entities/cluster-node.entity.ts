import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'cluster_nodes' })
export class ClusterNode {
  @PrimaryColumn({ type: 'varchar', length: 80 })
  id: string;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 120 })
  region: string;

  @Column({ type: 'int', nullable: true })
  latencyMs: number | null;

  @Column({ type: 'enum', enum: ['online', 'offline', 'maintenance'], default: 'offline' })
  status: 'online' | 'offline' | 'maintenance';

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}