import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'website_submissions' })
export class WebsiteSubmission {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 180 })
  name: string;

  @Column({ type: 'varchar', length: 80 })
  hash: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  fullHash: string | null;

  @Column({ type: 'varchar', length: 255 })
  submittedBy: string;

  @Column({ type: 'timestamptz' })
  submittedAt: Date;

  @Column({ type: 'json' })
  adminVotes: number[];

  @Column({ type: 'json' })
  clientVotes: number[];

  @Column({ type: 'varchar', length: 2048 })
  url: string;

  @Column({ type: 'enum', enum: ['Hidden', 'Visible'], default: 'Hidden' })
  status: 'Hidden' | 'Visible';

  @Column({ type: 'varchar', length: 255 })
  appearance: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json' })
  categories: string[];

  @Column({ type: 'json' })
  tags: string[];

  @Column({ type: 'varchar', length: 128 })
  username: string;

  @Column({ type: 'varchar', length: 80 })
  role: string;
}