import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from "dotenv"
import { User } from './auth/entities/auth.entity';
import { QuestionsModule } from './questions/questions.module';
import { TagsModule } from './tags/tags.module';
import { Question } from './questions/entities/question.entity';
import { Tag } from './tags/entities/tag.entity';
import { AnswersModule } from './answers/answers.module';
import { VotesModule } from './votes/votes.module';
import { Answer } from './answers/entities/answer.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'stackoverflow',
      entities: [User,Question,Tag,Answer],
      synchronize: false,
      //   ssl: {
      //   rejectUnauthorized: false,
      // },

    }),

    AuthModule,

    QuestionsModule,

    TagsModule,

    AnswersModule,

    VotesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
