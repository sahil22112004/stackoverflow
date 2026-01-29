import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from "dotenv"
import { User } from './auth/entities/auth.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'stackoverflow',
      entities: [User],
      synchronize: false,
      //   ssl: {
      //   rejectUnauthorized: false,
      // },

    }),

    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
