import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableRole1681365080638 implements MigrationInterface {
    name = 'CreateTableRole1681365080638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role" ("_id" SERIAL NOT NULL, "name" character varying NOT NULL, "portal" character varying NOT NULL, "permissions" json, "status" integer NOT NULL DEFAULT '1', "system_role" json, "key" character varying, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c983101a8be5ce732e3b63a9730" PRIMARY KEY ("_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
