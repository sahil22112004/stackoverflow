import { Question } from 'src/questions/entities/question.entity';
import { User } from '../../auth/entities/auth.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Answer } from '../../answers/entities/answer.entity';

export enum VoteStatus {
  upvote = 'upvote',
  downvote = 'downvote',
}


@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Answer)
  @JoinColumn({ name: 'answerId' })
  answer: Answer;

  @Column({ type: 'uuid' })
  answerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({
      type: 'enum',
      enum: VoteStatus,
    })
    status: VoteStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @UpdateDateColumn()
  deletedAt: Date;
}
