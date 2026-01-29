import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Question, QuestionStatus } from './entities/question.entity';
import { Tag } from '../tags/entities/tag.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionQuery } from './interfaces/question-query.interface';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

async create(createQuestionDto: CreateQuestionDto) {
  const tagIds: number[] = [];

  for (const tagName of createQuestionDto.tags) {
    const normalizedTag = tagName.trim().toLowerCase();

    let tag = await this.tagRepository.findOne({
      where: { name: normalizedTag },
    });

    if (!tag) {
      tag = this.tagRepository.create({ name: normalizedTag });
      tag = await this.tagRepository.save(tag);
    }

    tagIds.push(tag.id);
  }

  const question:any = this.questionRepository.create({
    title: createQuestionDto.title,
    description: createQuestionDto.description,
    status: createQuestionDto.status, 
    userId: createQuestionDto.userId,
    tagIds,
  });

  return await this.questionRepository.save(question);
}


   async findAllPublic(query: QuestionQuery) {
    const {
      search,
      tags,
      limit = 10,
      offset = 0,
    } = query

    const qb = this.questionRepository
      .createQueryBuilder('question')
      .where('question.status = :status', {
        status: QuestionStatus.published,
      })

    if (search) {
      qb.andWhere(
        '(LOWER(question.title) LIKE LOWER(:search) OR LOWER(question.description) LIKE LOWER(:search))',
        { search: `%${search}%` }
      )
    }

    if (tags && tags.length > 0) {
      const foundTags = await this.tagRepository.find({
        where: { name: In(tags) },
      })

      const tagIds = foundTags.map(t => t.id)

      if (tagIds.length === 0) {
        return { total: 0, questions: [] }
      }

      qb.andWhere('question.tagIds && ARRAY[:...tagIds]', { tagIds })
    }

    qb.skip(offset).take(limit)

    const [questions, total] = await qb.getManyAndCount()

    const allTagIds = [...new Set(questions.flatMap(q => q.tagIds))]
    const allTags = await this.tagRepository.find({
      where: { id: In(allTagIds) },
    })

    const tagMap = new Map<number, string>()
    allTags.forEach(t => tagMap.set(t.id, t.name))

    const result = questions.map(q => ({
      id: q.id,
      title: q.title,
      description: q.description,
      status: q.status,
      createdAt: q.createdAt,
      tags: q.tagIds.map(id => tagMap.get(id)),
    }))

    return { total, questions: result }
  }

  async findAllByUser(userId: string) {
    return await this.questionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const question = await this.questionRepository.findOne({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return question;
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.findOne(id);

    Object.assign(question, updateQuestionDto);

    return await this.questionRepository.save(question);
  }

  async remove(id: number) {
    const question = await this.findOne(id);
    await this.questionRepository.remove(question);

    return { message: 'Question deleted successfully' };
  }
}
