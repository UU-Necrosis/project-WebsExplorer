import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  lastSubmissionAt: Date | null;
}
