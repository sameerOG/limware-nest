import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableTestCategory1681454594161 implements MigrationInterface {
    name = 'CreateTableTestCategory1681454594161'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "test_category" ("_id" SERIAL NOT NULL, "is_template" boolean, "ref_code" character varying, "parent_category_id" character varying, "pl_category_id" character varying, "name" character varying NOT NULL, "title_for_print" character varying NOT NULL, "type" character varying NOT NULL, "report_template" character varying NOT NULL, "description" character varying, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "facility_id" integer, "laboratory_id" integer, "department_id" integer, CONSTRAINT "PK_de238b05bc07456e8b80b0f1abb" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "test_category" ADD CONSTRAINT "FK_0fe0d9a0f1625820680c570aad3" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test_category" ADD CONSTRAINT "FK_81db446bf4b1538ff953767fff6" FOREIGN KEY ("laboratory_id") REFERENCES "laboratory"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test_category" ADD CONSTRAINT "FK_dbdd48fe099f5d73983d2123051" FOREIGN KEY ("department_id") REFERENCES "department"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test_category" DROP CONSTRAINT "FK_dbdd48fe099f5d73983d2123051"`);
        await queryRunner.query(`ALTER TABLE "test_category" DROP CONSTRAINT "FK_81db446bf4b1538ff953767fff6"`);
        await queryRunner.query(`ALTER TABLE "test_category" DROP CONSTRAINT "FK_0fe0d9a0f1625820680c570aad3"`);
        await queryRunner.query(`DROP TABLE "test_category"`);
    }

}
