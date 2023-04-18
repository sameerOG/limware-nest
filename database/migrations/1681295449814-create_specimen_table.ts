import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSpecimenTable1681295449814 implements MigrationInterface {
    name = 'CreateSpecimenTable1681295449814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "specimen" ("_id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dd425851584b10761c7b017ff44" PRIMARY KEY ("_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "specimen"`);
    }

}
