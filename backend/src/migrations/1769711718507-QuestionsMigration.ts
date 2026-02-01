import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm'

export class QuestionsMigration1769711718507 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'questions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['draft', 'published'],
            default: `'draft'`,
          },
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'tagIds',
            type: 'uuid',
            isArray: true,
          },
          {
            name: 'upvotes',
            type: 'int',
            default: 0,
          },
          {
            name: 'downvotes',
            type: 'int',
            default: 0,
          },
          {
            name: 'score',
            type: 'int',
            default: 0,
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
        ],
      }),
      true
    )

    await queryRunner.createForeignKey(
      'questions',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    )

    await queryRunner.createIndex(
      'questions',
      new TableIndex({
        name: 'IDX_QUESTIONS_SCORE',
        columnNames: ['score'],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('questions')
  }
}
