import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableColumn } from 'typeorm';

export class VoteMigration1769767328079 implements MigrationInterface { 
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'votes',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'answerId',
          type: 'uuid', 
          isNullable: false,
        },
        {
          name: 'userId',
          type: 'uuid', 
          isNullable: false,
        },
        {
          name: 'status',
          type: 'enum',
          enum: ['upvote', 'downvote'], 
          isNullable: false,
        },
        {
          name: 'createdAt',
          type: 'timestamp',
          default: 'NOW()',
        },
        {
          name: 'updatedAt',
          type: 'timestamp',
          default: 'NOW()',
        },
        {
          name: 'deletedAt', 
          type: 'timestamp',
          isNullable: true,
        },
      ],
    }), true);

    await queryRunner.createForeignKey('votes', new TableForeignKey({
      columnNames: ['answerId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'answers', 
      onDelete: 'CASCADE', 
    }));

    await queryRunner.createForeignKey('votes', new TableForeignKey({
      columnNames: ['userId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users', 
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('votes');
  }
}
