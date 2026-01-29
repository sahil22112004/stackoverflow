import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class UserMigration1769143681417 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isNullable: false,
                        isUnique: true
                    },
                    {
                        name: "username",
                        type: "varchar",
                        isNullable: true,

                    },
                    {
                        name: "createdAt",
                        type: "varchar",
                        default: 'NOW()',
                        isNullable: false,
                    },
                    {
                        name: "updatedAt",
                        type: "varchar",
                        default: 'NOW()',
                        isNullable: false,
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }

}