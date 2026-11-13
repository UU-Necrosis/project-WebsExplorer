import { CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { WebsiteSubmission } from './website-submission.entity';

@Entity({ name: 'websites_saved' })
export class WebsiteSaved {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  submissionId: string;

  @OneToOne(() => WebsiteSubmission, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'submissionId', referencedColumnName: 'id' })
  submission: WebsiteSubmission;

  @CreateDateColumn({ type: 'timestamptz' })
  savedAt: Date;
}