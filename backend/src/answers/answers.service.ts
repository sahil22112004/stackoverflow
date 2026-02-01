import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, IsNull } from 'typeorm'
import { Answer } from './entities/answer.entity'
import { CreateAnswerDto } from './dto/create-answer.dto'
import { AnswerQuery } from './interface/answer-query.interface'

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepo: Repository<Answer>,
  ) {}

  async create(dto: CreateAnswerDto) {
    if (dto.parentAnswerId) {
      const parent = await this.answerRepo.findOne({
        where: { id: dto.parentAnswerId },
      })

      if (!parent) {
        throw new BadRequestException('Parent answer not found')
      }

      if (parent.questionId !== dto.questionId) {
        throw new BadRequestException(
          'Reply must belong to the same question',
        )
      }
    }

    const answer = this.answerRepo.create({
      questionId: dto.questionId,
      userId: dto.userId,
      answer: dto.answer,
      parentAnswerId: dto.parentAnswerId ?? null,
    })

    return this.answerRepo.save(answer)
  }

  async findForQuestion(questionId: string, query: AnswerQuery) {
    const limit = Number(query.limit) || 10
    const offset = Number(query.offset) || 0

    const [answers, total] = await this.answerRepo.findAndCount({
      where: {
        questionId,
        parentAnswerId: IsNull(),
      },
      order: {
        score: 'DESC',
        createdAt: 'ASC',
      },
      skip: offset,
      take: limit,
    })

    return {
      answers,
      total,
      limit,
      offset,
    }
  }

  async findReplies(parentAnswerId: string) {
    return this.answerRepo.find({
      where: {
        parentAnswerId,
      },
      order: {
        score: 'DESC',
        createdAt: 'ASC',
      },
    })
  }
}
