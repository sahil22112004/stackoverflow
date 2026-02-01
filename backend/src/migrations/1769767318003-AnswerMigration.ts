import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm'

export class AnswerMigration1769767318003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)

    await queryRunner.createTable(
      new Table({
        name: 'answers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'questionId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'parentAnswerId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'answer',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'isValid',
            type: 'boolean',
            default: false,
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
      true,
    )

    await queryRunner.createForeignKey(
      'answers',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    )

    await queryRunner.createForeignKey(
      'answers',
      new TableForeignKey({
        columnNames: ['questionId'],
        referencedTableName: 'questions',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    )

    await queryRunner.createForeignKey(
      'answers',
      new TableForeignKey({
        columnNames: ['parentAnswerId'],
        referencedTableName: 'answers',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    )

    await queryRunner.createIndex(
      'answers',
      new TableIndex({
        name: 'IDX_ANSWERS_QUESTION',
        columnNames: ['questionId'],
      }),
    )

    await queryRunner.createIndex(
      'answers',
      new TableIndex({
        name: 'IDX_ANSWERS_PARENT',
        columnNames: ['parentAnswerId'],
      }),
    )

    await queryRunner.createIndex(
      'answers',
      new TableIndex({
        name: 'IDX_ANSWERS_SCORE',
        columnNames: ['score'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('answers')
  }
}
