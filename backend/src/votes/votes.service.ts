import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { Vote } from './entities/vote.entity'
import {
  CreateVoteDto,
  VoteStatus,
  VoteTargetType,
} from './dto/create-vote.dto'
import { Answer } from '../answers/entities/answer.entity'
import { Question } from '../questions/entities/question.entity'

@Injectable()
export class VotesService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Vote)
    private readonly voteRepo: Repository<Vote>,

    @InjectRepository(Answer)
    private readonly answerRepo: Repository<Answer>,

    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  async vote(dto: CreateVoteDto) {
    const { targetId, targetType, userId, status } = dto

    return this.dataSource.transaction(async manager => {
      const voteRepo = manager.getRepository(Vote)
      const answerRepo = manager.getRepository(Answer)
      const questionRepo = manager.getRepository(Question)

      const existing = await voteRepo.findOne({
        where: { targetId, targetType, userId },
        withDeleted: true,
      })

      let upVote = 0
      let downVote = 0
      let scoreVote = 0

      if (!existing) {
        await voteRepo.save(voteRepo.create(dto))
        status === VoteStatus.upvote
          ? (upVote = 1, scoreVote = 1)
          : (downVote = 1, scoreVote = -1)
      } 
      else if (existing.deletedAt) {
        existing.status = status
        existing.deletedAt = null
        await voteRepo.save(existing)
        status === VoteStatus.upvote
          ? (upVote = 1, scoreVote = 1)
          : (downVote = 1, scoreVote = -1)
      } 
      else if (existing.status === status) {
        await voteRepo.softDelete(existing.id)
        status === VoteStatus.upvote
          ? (upVote = -1, scoreVote = -1)
          : (downVote = -1, scoreVote = 1)
      } 
      else {
        existing.status = status
        await voteRepo.save(existing)
        status === VoteStatus.upvote
          ? (upVote = 1, downVote = -1, scoreVote = 2)
          : (upVote = -1, downVote = 1, scoreVote = -2)
      }

      if (targetType === VoteTargetType.answer) {
        await answerRepo.increment({ id: targetId }, 'upvotes', upVote)
        await answerRepo.increment({ id: targetId }, 'downvotes', downVote)
        await answerRepo.increment({ id: targetId }, 'score', scoreVote)
      } else {
        await questionRepo.increment({ id: targetId }, 'upvotes', upVote)
        await questionRepo.increment({ id: targetId }, 'downvotes', downVote)
        await questionRepo.increment({ id: targetId }, 'score', scoreVote)
      }

      return { upVote, downVote, scoreVote }
    })
  }
}
