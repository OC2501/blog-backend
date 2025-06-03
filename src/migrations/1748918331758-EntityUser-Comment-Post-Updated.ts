import { MigrationInterface, QueryRunner } from "typeorm";

export class EntityUserCommentPostUpdated1748918331758 implements MigrationInterface {
    name = 'EntityUserCommentPostUpdated1748918331758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_active" boolean NOT NULL DEFAULT true, "name" character varying(100) NOT NULL, "description" text, "slug" character varying(255), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_active" boolean NOT NULL DEFAULT true, "name" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, CONSTRAINT "UQ_b3aa10c29ea4e61a830362bd25a" UNIQUE ("slug"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "likes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_active" boolean NOT NULL DEFAULT true, "post_id" uuid, "user_id" uuid, CONSTRAINT "PK_a9323de3f8bced7539a794b4a37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'USER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_active" boolean NOT NULL DEFAULT true, "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "bio" character varying(255) NOT NULL, "position" character varying(255) NOT NULL, "department" character varying(255) NOT NULL, "avatar" character varying(255), "facebook" character varying(255), "twitter" character varying(255), "instagram" character varying(255), "linkedin" character varying(255), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_active" boolean NOT NULL DEFAULT true, "content" text NOT NULL, "postId" uuid, "userId" uuid, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."posts_status_enum" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED')`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_active" boolean NOT NULL DEFAULT true, "title" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "content" text NOT NULL, "status" "public"."posts_status_enum" NOT NULL DEFAULT 'PUBLISHED', "published_at" TIMESTAMP NOT NULL, "excerpt" character varying(255) NOT NULL, "featuredimage" character varying(255), "viewcount" integer NOT NULL DEFAULT '0', "userId" uuid, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post_category" ("category_id" uuid NOT NULL, "post_id" uuid NOT NULL, CONSTRAINT "PK_adbadf9ed503800035d1ddcb331" PRIMARY KEY ("category_id", "post_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_86920132d7d239eea7e091bf47" ON "post_category" ("category_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_44d258cc3d7387a9a39ec8c27a" ON "post_category" ("post_id") `);
        await queryRunner.query(`CREATE TABLE "post_tags" ("tag_id" uuid NOT NULL, "post_id" uuid NOT NULL, CONSTRAINT "PK_deee54a40024b7afc16d25684f8" PRIMARY KEY ("tag_id", "post_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_192ab488d1c284ac9abe2e3035" ON "post_tags" ("tag_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_5df4e8dc2cb3e668b962362265" ON "post_tags" ("post_id") `);
        await queryRunner.query(`CREATE TABLE "posts_categories" ("postId" uuid NOT NULL, "categoryId" uuid NOT NULL, CONSTRAINT "PK_cbe690e1e7836c439db6276dd37" PRIMARY KEY ("postId", "categoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e631d81d13c3b2e0e286524369" ON "posts_categories" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_73f979ccddcdf8c7e1aa066329" ON "posts_categories" ("categoryId") `);
        await queryRunner.query(`CREATE TABLE "posts_tags" ("postId" uuid NOT NULL, "tagId" uuid NOT NULL, CONSTRAINT "PK_da04893cf52aadaace6b6686888" PRIMARY KEY ("postId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8001e7fb6ff37581be869693c0" ON "posts_tags" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_46d37fa943bb7d233d5987877e" ON "posts_tags" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_741df9b9b72f328a6d6f63e79ff" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_3f519ed95f775c781a254089171" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_ae05faaa55c866130abef6e1fee" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_category" ADD CONSTRAINT "FK_86920132d7d239eea7e091bf477" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "post_category" ADD CONSTRAINT "FK_44d258cc3d7387a9a39ec8c27a4" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_tags" ADD CONSTRAINT "FK_192ab488d1c284ac9abe2e30356" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "post_tags" ADD CONSTRAINT "FK_5df4e8dc2cb3e668b962362265d" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts_categories" ADD CONSTRAINT "FK_e631d81d13c3b2e0e286524369c" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "posts_categories" ADD CONSTRAINT "FK_73f979ccddcdf8c7e1aa066329d" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts_tags" ADD CONSTRAINT "FK_8001e7fb6ff37581be869693c0c" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "posts_tags" ADD CONSTRAINT "FK_46d37fa943bb7d233d5987877ec" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts_tags" DROP CONSTRAINT "FK_46d37fa943bb7d233d5987877ec"`);
        await queryRunner.query(`ALTER TABLE "posts_tags" DROP CONSTRAINT "FK_8001e7fb6ff37581be869693c0c"`);
        await queryRunner.query(`ALTER TABLE "posts_categories" DROP CONSTRAINT "FK_73f979ccddcdf8c7e1aa066329d"`);
        await queryRunner.query(`ALTER TABLE "posts_categories" DROP CONSTRAINT "FK_e631d81d13c3b2e0e286524369c"`);
        await queryRunner.query(`ALTER TABLE "post_tags" DROP CONSTRAINT "FK_5df4e8dc2cb3e668b962362265d"`);
        await queryRunner.query(`ALTER TABLE "post_tags" DROP CONSTRAINT "FK_192ab488d1c284ac9abe2e30356"`);
        await queryRunner.query(`ALTER TABLE "post_category" DROP CONSTRAINT "FK_44d258cc3d7387a9a39ec8c27a4"`);
        await queryRunner.query(`ALTER TABLE "post_category" DROP CONSTRAINT "FK_86920132d7d239eea7e091bf477"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_ae05faaa55c866130abef6e1fee"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_3f519ed95f775c781a254089171"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_741df9b9b72f328a6d6f63e79ff"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_46d37fa943bb7d233d5987877e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8001e7fb6ff37581be869693c0"`);
        await queryRunner.query(`DROP TABLE "posts_tags"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_73f979ccddcdf8c7e1aa066329"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e631d81d13c3b2e0e286524369"`);
        await queryRunner.query(`DROP TABLE "posts_categories"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5df4e8dc2cb3e668b962362265"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_192ab488d1c284ac9abe2e3035"`);
        await queryRunner.query(`DROP TABLE "post_tags"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_44d258cc3d7387a9a39ec8c27a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86920132d7d239eea7e091bf47"`);
        await queryRunner.query(`DROP TABLE "post_category"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TYPE "public"."posts_status_enum"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
