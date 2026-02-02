import { Controller, Post, Body, Get, Param, Query, Patch } from '@nestjs/common'
import { AnswersService } from './answers.service'
import { CreateAnswerDto } from './dto/create-answer.dto'
import type { AnswerQuery } from './interface/answer-query.interface'
import { updateanswervalidDto } from './dto/update-validanswer.dto'

@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post()
  create(@Body() dto: CreateAnswerDto) {
    return this.answersService.create(dto)
  }

  @Get('question/:questionId')
  findForQuestion(
    @Param('questionId') questionId: string,
    @Query() query: AnswerQuery,
  ) {
    return this.answersService.findForQuestion(questionId, query)
  }

  @Get('replies/:parentAnswerId')
findReplies(
  @Param('parentAnswerId') parentAnswerId: string,
  @Query('limit') limit?: number,
  @Query('offset') offset?: number,
) {
  return this.answersService.findReplies(parentAnswerId, {
    limit,
    offset,
  })
}


  @Patch('/markValid')
  markValid(@Body() dto: updateanswervalidDto) {
    console.log('working',dto)
    return this.answersService.markValid(dto)
  }
}
