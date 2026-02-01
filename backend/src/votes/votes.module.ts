import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { Vote } from './entities/vote.entity';
import { Answer } from '../answers/entities/answer.entity';
import { Question } from '../questions/entities/question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vote,Answer,Question,]),
  ],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}
