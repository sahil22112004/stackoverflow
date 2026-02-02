import { IsEnum } from 'class-validator'
import { QuestionStatus } from './create-question.dto'

export class UpdateQuestionStatusDto {

  @IsEnum(QuestionStatus)
  status?: QuestionStatus
}
