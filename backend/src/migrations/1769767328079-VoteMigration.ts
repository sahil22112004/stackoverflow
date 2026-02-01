import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class VoteMigration1769767328079 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)

    await queryRunner.createTable(
      new Table({
        name: 'votes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'targetId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'targetType',
            type: 'enum',
            enum: ['question', 'answer'],
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['upvote', 'downvote'],
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true
    )

    await queryRunner.createIndex(
      'votes',
      new TableIndex({
        name: 'IDX_VOTES_USER_TARGET',
        columnNames: ['userId', 'targetId', 'targetType'],
        isUnique: true,
      })
    )

    await queryRunner.createIndex(
      'votes',
      new TableIndex({
        name: 'IDX_VOTES_DELETED_AT',
        columnNames: ['deletedAt'],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('votes')
  }
}
