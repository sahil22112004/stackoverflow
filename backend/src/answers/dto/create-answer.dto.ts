import { IsUUID, IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateAnswerDto {
  @IsUUID()
  questionId: string

  @IsUUID()
  userId: string

  @IsString()
  @IsNotEmpty()
  answer: string

  @IsUUID()
  @IsOptional()
  parentAnswerId?: string
}
