import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableFeature1681375859904 implements MigrationInterface {
    name = 'CreateTableFeature1681375859904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "feature_permission" ("_id" SERIAL NOT NULL, "name" character varying NOT NULL, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_130179aa2438a2b37ebc20ce6c2" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "feature" ("_id" SERIAL NOT NULL, "title" character varying, "content" character varying NOT NULL, "is_published" boolean, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e70d3c3388d45b470ce8ebe23f7" PRIMARY KEY ("_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "feature"`);
        await queryRunner.query(`DROP TABLE "feature_permission"`);
    }

}
