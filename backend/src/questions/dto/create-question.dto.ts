import { IsString, IsNotEmpty, MinLength, IsArray, ArrayMinSize, IsEnum, IsNumber, IsUUID } from 'class-validator';

enum QuestionStatus {
  draft = 'draft',
  published = 'published',
}

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  tags: string[];

  @IsUUID()
  @IsNotEmpty()
  userId: string;
  
  @IsEnum(QuestionStatus)
  status: QuestionStatus;
}
