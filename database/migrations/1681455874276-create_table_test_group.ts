import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableTestGroup1681455874276 implements MigrationInterface {
    name = 'CreateTableTestGroup1681455874276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "test_group" ("_id" SERIAL NOT NULL, "is_template" boolean, "archived" boolean NOT NULL DEFAULT false, "pl_group_id" integer, "name" character varying NOT NULL, "facility_id" integer, "parent" character varying NOT NULL, "parent_id" integer NOT NULL, "sequence" integer, "description" character varying, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "laboratory_id" integer, CONSTRAINT "PK_c74eee2a05b7b7357cb09b0c13a" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "test_group" ADD CONSTRAINT "FK_210c6ec96e82efd68945d5ad62a" FOREIGN KEY ("laboratory_id") REFERENCES "laboratory"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test_group" DROP CONSTRAINT "FK_210c6ec96e82efd68945d5ad62a"`);
        await queryRunner.query(`DROP TABLE "test_group"`);
    }

}
