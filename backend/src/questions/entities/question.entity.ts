import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum QuestionStatus {
  draft = 'draft',
  published = 'published',
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string


  @Column({ length: 255 })
  title: string

  @Column({ type: 'text' })
  description: string

  @Column({
    type: 'enum',
    enum: QuestionStatus,
    default: QuestionStatus.draft,
  })
  status: QuestionStatus

  @Column({ type: 'uuid' })
  userId: string

  @Column('uuid', { array: true })
  tagIds: string[]

  @Column({ default: 0 })
  upvotes: number

  @Column({ default: 0 })
  downvotes: number

  @Column({ default: 0 })
  score: number

  @Column({default:false})
  isBlocked:boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
