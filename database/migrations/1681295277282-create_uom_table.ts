import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUomTable1681295277282 implements MigrationInterface {
    name = 'CreateUomTable1681295277282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "uom" ("_id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_45676bd07b2b20c3027260018cf" PRIMARY KEY ("_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "uom"`);
    }

}
