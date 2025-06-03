import { MigrationInterface, QueryRunner } from "typeorm";

export class PublishedAtUpdate1748918595052 implements MigrationInterface {
    name = 'PublishedAtUpdate1748918595052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "published_at" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "published_at" DROP DEFAULT`);
    }

}
