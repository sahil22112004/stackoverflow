import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Unique,
} from 'typeorm'
import { VoteStatus, VoteTargetType } from '../dto/create-vote.dto'

@Entity('votes')
@Unique(['userId', 'targetId', 'targetType'])
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  userId: string

  @Column({ type: 'uuid' })
  targetId: string

  @Column({ type: 'enum', enum: VoteTargetType })
  targetType: VoteTargetType

  @Column({ type: 'enum', enum: VoteStatus })
  status: VoteStatus

  @CreateDateColumn()
  createdAt: Date

  @DeleteDateColumn()
  deletedAt: Date | null
}
