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


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1104',
      database: 'stackoverflow',
      entities: [User,Question,Tag],
      synchronize: false,
      //   ssl: {
      //   rejectUnauthorized: false,
      // },

    }),

    AuthModule,

    QuestionsModule,

    TagsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
