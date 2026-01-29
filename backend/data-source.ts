// import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
// import UserSeeder from './src/database/seeds/user.seeder';
// import UserFactory from './src/database/factories/user.factory';
import { config } from "dotenv"
import { User } from './src/auth/entities/auth.entity';

config();

const datasource :DataSourceOptions & SeederOptions={
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'stackoverflow',
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, 
  // factories: [UserFactory],
  seeds: [],
  // ssl: {
  //   rejectUnauthorized: false,
  // },
}

export const AppDataSource = new DataSource(datasource);