import { User } from '../../auth/entities/auth.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

export enum QuestionStatus {
  draft = 'draft',
  published = 'published',
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: QuestionStatus,
    default: QuestionStatus.draft,
  })
  status: QuestionStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

@Column({ type: 'uuid' })
  userId: string;

  @Column('int', { array: true })
  tagIds: number[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
