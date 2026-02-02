import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, IsNull } from 'typeorm'
import { Answer } from './entities/answer.entity'
import { CreateAnswerDto } from './dto/create-answer.dto'
import { AnswerQuery } from './interface/answer-query.interface'
import { updateanswervalidDto } from './dto/update-validanswer.dto'

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepo: Repository<Answer>,
  ) {}

  async create(createAnswerDto: CreateAnswerDto) {
    if (createAnswerDto.parentAnswerId) {
      const parent = await this.answerRepo.findOne({
        where: { id: createAnswerDto.parentAnswerId },
      })

      if (!parent) {
        throw new BadRequestException('Parent answer not found')
      }

      if (parent.questionId !== createAnswerDto.questionId) {
        throw new BadRequestException(
          'Reply must belong to the same question',
        )
      }
    }

    const answer = this.answerRepo.create({
      questionId: createAnswerDto.questionId,
      userId: createAnswerDto.userId,
      answer: createAnswerDto.answer,
      parentAnswerId: createAnswerDto.parentAnswerId ?? null,
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

  async markValid(validDto:updateanswervalidDto){

    console.log('service dto',validDto)
    const {isValid,id} = validDto
    const data = await this.answerRepo.update(id,{isValid})
    console.log("data is ",data)

    return {message:'maked valid'}
  }
}
