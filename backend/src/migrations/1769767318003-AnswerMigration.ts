import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class AnswerMigration1769767318003 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "answers",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "questionId",
                        type: "int",
                    },
                    {
                        name: "userId",
                        type: "uuid",
                    },
                    {
                        name: "answer",
                        type: "text",
                    },
                    
                    {
                        name: "isValid",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "NOW()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "NOW()",
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "answers",
            new TableForeignKey({
                columnNames: ["userId"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "answers",
            new TableForeignKey({
                columnNames: ["questionId"],
                referencedTableName: "questions",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("answers");
    }
}
