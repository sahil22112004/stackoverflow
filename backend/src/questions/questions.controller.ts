import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common'
import { QuestionsService } from './questions.service'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'
import type { QuestionQuery } from './interfaces/question-query.interface'
import { UpdateQuestionStatusDto } from './dto/update-QuestionStatus.dto'
import { UpdateQuestionBlockDto } from './dto/update-questionblock.dto'

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  create(@Body() dto: CreateQuestionDto) {
    return this.questionsService.create(dto)
  }

  @Get()
  findAllPublic(@Query() query: QuestionQuery) {
    return this.questionsService.findAllPublic(query)
  }

  @Get('allQuestions')
  findAll() {
    return this.questionsService.findAll()
  }


  @Get('user/:userId')
  findAllByUser(@Param('userId') userId: string) {
    return this.questionsService.findAllByUser(userId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.questionsService.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id)
  }

  @Patch('udataeStatus/:id')
  updatestatus(@Param('id') id: string, @Body() dto: UpdateQuestionStatusDto) {
    return this.questionsService.updatestatus(id, dto)}

  @Patch('updateIsBlocked/:id')
  updateIsBlocked(@Param('id') id: string, @Body() dto: UpdateQuestionBlockDto) {
    return this.questionsService.updateIsBlocked(id, dto)}
}
