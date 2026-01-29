import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class QuestionsMigration1769711718507 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "questions",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "title",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["draft", "published"],
                        default: `'draft'`,
                    },
                    {
                        name: "userId",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "tagIds",
                        type: "int",
                        isArray: true,
                        isNullable: false,
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
            "questions",
            new TableForeignKey({
                columnNames: ["userId"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("questions");
    }
}
