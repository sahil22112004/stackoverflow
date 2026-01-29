import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Tag } from '../../tags/entities/tag.entity';

export default class TagSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Tag);

    await repository.insert([
      { name: 'javascript' },
      { name: 'typescript' },
      { name: 'react' },
      { name: 'nextjs' },
      { name: 'nestjs' },
      { name: 'nodejs' },
      { name: 'express' },
      { name: 'html' },
      { name: 'css' },
      { name: 'database' },
      { name: 'postgresql' },
      { name: 'mysql' },
      { name: 'api' },
      { name: 'backend' },
      { name: 'frontend' },
    ]);
  }
}
