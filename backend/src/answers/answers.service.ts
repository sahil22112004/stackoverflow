import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';

@Injectable()
export class AnswersService {
    constructor(
      @InjectRepository(Answer)
      private readonly AnswerRepository: Repository<Answer>,

    ) {}
  async create(createAnswerDto: CreateAnswerDto) {
    const {Answer,questionId,userId} = createAnswerDto
    const answer:any={
      answer:Answer,
      questionId:+questionId,
      userId
    }
    console.log(answer)
    const question:any = this.AnswerRepository.create({...answer})
    return await this.AnswerRepository.save(question);
  }

  findAll() {
    return `This action returns all answers`;
  }

  findAnswerForQuestion(id: number) {
    const Answers = this.AnswerRepository.find(
      {where:{questionId:id}}
    )
    return Answers;
  }

  update(id: number, updateAnswerDto: UpdateAnswerDto) {
    return `This action updates a #${id} answer`;
  }

  remove(id: number) {
    return `This action removes a #${id} answer`;
  }
}
