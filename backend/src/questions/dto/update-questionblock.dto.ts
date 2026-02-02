import { IsBoolean } from 'class-validator'

export class UpdateQuestionBlockDto {

  @IsBoolean()
  isBlocked?: boolean
}
