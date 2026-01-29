import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Tag } from '../tags/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question,Tag])],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
