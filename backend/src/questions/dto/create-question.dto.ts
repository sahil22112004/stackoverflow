import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsArray,
  ArrayMinSize,
  IsEnum,
  IsUUID,
} from 'class-validator'

export enum QuestionStatus {
  draft = 'draft',
  published = 'published',
}

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  title: string

  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  description: string

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  tags: string[]

  @IsUUID()
  userId: string

  @IsEnum(QuestionStatus)
  status: QuestionStatus
}
