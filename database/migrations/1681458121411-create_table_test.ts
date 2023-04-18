import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableTest1681458121411 implements MigrationInterface {
    name = 'CreateTableTest1681458121411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "test" ("_id" SERIAL NOT NULL, "is_template" boolean, "ref_code" character varying, "template_test_id" integer, "pl_test_id" integer, "facility_id" integer, "code" integer, "name" character varying NOT NULL, "title_for_print" character varying NOT NULL, "sample_quantity" character varying, "res_input_type" character varying, "decimal_length" integer, "res_input_options" character varying, "description" character varying, "default_notes" character varying, "duration" character varying, "single_or_group" character varying NOT NULL, "status" integer NOT NULL DEFAULT '1', "sequence" integer, "print_or_seperate_page" boolean NOT NULL DEFAULT false, "reports_template" character varying, "tags" character varying, "parametric_only" boolean NOT NULL DEFAULT false, "archived" character varying NOT NULL DEFAULT false, "parent_test_id" integer DEFAULT NULL, "default_result" character varying, "report_template_name" character varying, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "laboratory_id" integer, "test_category_id" integer, "uom_id" integer, "specimen_id" integer, "department_id" integer, CONSTRAINT "PK_691b52f01e89b4049f8a79e68b5" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "test" ADD CONSTRAINT "FK_a73560dffe4f5b981efb46d3812" FOREIGN KEY ("laboratory_id") REFERENCES "laboratory"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test" ADD CONSTRAINT "FK_2b70db914aa4a90289223f2722e" FOREIGN KEY ("test_category_id") REFERENCES "test_category"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test" ADD CONSTRAINT "FK_2d6ea7c5bfc914812527e6113e4" FOREIGN KEY ("uom_id") REFERENCES "uom"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test" ADD CONSTRAINT "FK_fe87490c9f46de19aea52e5ab99" FOREIGN KEY ("specimen_id") REFERENCES "specimen"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test" ADD CONSTRAINT "FK_5fa5d019a6bd45ed62526a3da23" FOREIGN KEY ("department_id") REFERENCES "department"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" DROP CONSTRAINT "FK_5fa5d019a6bd45ed62526a3da23"`);
        await queryRunner.query(`ALTER TABLE "test" DROP CONSTRAINT "FK_fe87490c9f46de19aea52e5ab99"`);
        await queryRunner.query(`ALTER TABLE "test" DROP CONSTRAINT "FK_2d6ea7c5bfc914812527e6113e4"`);
        await queryRunner.query(`ALTER TABLE "test" DROP CONSTRAINT "FK_2b70db914aa4a90289223f2722e"`);
        await queryRunner.query(`ALTER TABLE "test" DROP CONSTRAINT "FK_a73560dffe4f5b981efb46d3812"`);
        await queryRunner.query(`DROP TABLE "test"`);
    }

}
