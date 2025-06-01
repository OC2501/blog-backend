import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedUsersandPost1748799703191 implements MigrationInterface {
    name = 'UpdatedUsersandPost1748799703191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "avatar" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "facebook" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "twitter" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "instagram" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "linkedin" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "featuredimage" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "viewcount" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "viewcount" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "featuredimage" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "linkedin" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "instagram" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "twitter" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "facebook" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "avatar" SET NOT NULL`);
    }

}
