import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { config } from "dotenv"
import { User } from './src/auth/entities/auth.entity';
import { Question } from './src/questions/entities/question.entity';
import { Tag } from './src/tags/entities/tag.entity';
import TagSeeder from './src/database/seeders/tag.seeder';
import { Answer } from './src/answers/entities/answer.entity';
import { Vote } from './src/votes/entities/vote.entity';

config();

const datasource :DataSourceOptions & SeederOptions={
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'stackoverflow',
  entities: [User,Question,Tag,Answer,Vote],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, 
  // factories: [UserFactory],
  seeds: [TagSeeder],
  // ssl: {
  //   rejectUnauthorized: false,
  // },
}

export const AppDataSource = new DataSource(datasource);