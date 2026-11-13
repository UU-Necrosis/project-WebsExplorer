import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

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

  @Column({ type: 'varchar', length: 36, nullable: true })
  submitterId: string | null;

  @Index('IDX_website_submissions_canonical_url', { unique: true })
  @Column({ type: 'varchar', length: 2048, nullable: true })
  canonicalUrl: string | null;

  @Column({ type: 'timestamptz' })
  submittedAt: Date;

  @Column({ type: 'json' })
  adminVotes: (number | string)[];

  @Column({ type: 'json' })
  clientVotes: (number | string)[];

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

  @Column({ type: 'varchar', length: 24, default: 'curator' })
  relationship: 'user' | 'creator' | 'curator';

  @Column({ type: 'varchar', length: 255, nullable: true })
  contactEmail: string | null;

  @Column({ type: 'integer', nullable: true })
  rating: number | null;

  @Column({ type: 'varchar', length: 16, default: '' })
  logoInitials: string;

  @Column({ type: 'boolean', default: false })
  ownershipAuthorized: boolean;

  @Column({ type: 'boolean', default: false })
  canVerifyConnection: boolean;
}