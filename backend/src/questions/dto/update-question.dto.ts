import { IsOptional, IsString, IsEnum } from 'class-validator'
import { QuestionStatus } from './create-question.dto'

export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsEnum(QuestionStatus)
  status?: QuestionStatus
}
