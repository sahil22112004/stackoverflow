import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Question } from './entities/question.entity'
import { Tag } from '../tags/entities/tag.entity'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'
import { QuestionQuery } from './interfaces/question-query.interface'
import { UpdateQuestionStatusDto } from './dto/update-QuestionStatus.dto'
import { UpdateQuestionBlockDto } from './dto/update-questionblock.dto'

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>
  ) {}

  async create(dto: CreateQuestionDto) {
    const tagIds: string[] = []

    for (const tagName of dto.tags) {
      const normalized = tagName.trim().toLowerCase()

      let tag = await this.tagRepository.findOne({
        where: { name: normalized },
      })

      if (!tag) {
        tag = this.tagRepository.create({ name: normalized })
        tag = await this.tagRepository.save(tag)
      }

      tagIds.push(String(tag.id))
    }

    const question = this.questionRepository.create({
      title: dto.title,
      description: dto.description,
      status: dto.status,
      userId: dto.userId,
      tagIds,
    })

    return this.questionRepository.save(question)
  }

  async findAllPublic(query: QuestionQuery) {
    const limit = Number(query.limit) || 10
    const offset = Number(query.offset) || 0

    const qb = this.questionRepository.createQueryBuilder('q')
     qb.andWhere('q.status = :status', { status: 'published' }) 
    

    if (query.search) {
      qb.andWhere(
        '(LOWER(q.title) LIKE :s OR LOWER(q.description) LIKE :s)',
        { s: `%${query.search.toLowerCase()}%` }
      )
    }

    const tags =
      typeof query.tags === 'string'
        ? query.tags.split(',').filter(Boolean)
        : query.tags?.filter(Boolean)

    if (tags && tags.length > 0) {
      const foundTags = await this.tagRepository.find({
        where: { name: In(tags) },
      })

      const tagIds = foundTags.map(t => t.id)

      if (tagIds.length === 0) {
        return { total: 0, questions: [] }
      }

      qb.andWhere('q.tagIds && ARRAY[:...tagIds]::uuid[]', {
        tagIds,
      })
    }

    if (query.sortByScore === 'true') {
      qb.orderBy('q.score', 'DESC')
    } else {
      qb.orderBy('q.createdAt', 'DESC')
    }


    qb.skip(offset).take(limit)

    const [questions, total] = await qb.getManyAndCount()

    return { total, questions }
  }

  async findAllByUser(userId: string) {
    console.log(userId)
    return this.questionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(id: string) {
    const question = await this.questionRepository.findOne({
      where: { id },
    })

    if (!question) {
      throw new NotFoundException('Question not found')
    }

    return question
  }

  async update(id: string, dto: UpdateQuestionDto) {
    const question = await this.findOne(id)
    Object.assign(question, dto)
    return this.questionRepository.save(question)
  }

  async remove(id: string) {
    const question = await this.findOne(id)
    await this.questionRepository.remove(question)
    return { deleted: true }
  }

  async updatestatus(id: string, dto: UpdateQuestionStatusDto) {
    const {status} =dto
    const data = await this.questionRepository.update(id,{status})
    return {message:'update status to publishes'}
  }

  async findAll(){
    return this.questionRepository.find()
  }
  
  async updateIsBlocked(id:string,dto:UpdateQuestionBlockDto){
    const {isBlocked} = dto
    const res = await this.questionRepository.update(id,{isBlocked})
    return {meassage:'succesfully change isBlocked'}
  }
}
