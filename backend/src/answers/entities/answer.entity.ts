import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  questionId: string

  @Column({ type: 'uuid' })
  userId: string

  @Column({ type: 'uuid', nullable: true })
  parentAnswerId: string | null

  @ManyToOne(() => Answer, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentAnswerId' })
  parent: Answer | null

  @Column({ type: 'text' })
  answer: string

  @Column({ default: false })
  isValid: boolean

  @Column({ default: 0 })
  upvotes: number

  @Column({ default: 0 })
  downvotes: number

  @Column({ default: 0 })
  score: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
