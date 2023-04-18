import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablePatientTest1681464689610 implements MigrationInterface {
    name = 'CreateTablePatientTest1681464689610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "patient_test" ("_id" SERIAL NOT NULL, "facility_id" integer NOT NULL, "laboratory_id" integer NOT NULL, "patient_account_id" integer, "patient_id" integer NOT NULL, "appointment_id" integer NOT NULL, "test_category_id" integer NOT NULL, "status" integer NOT NULL, "sample_status" integer, "sample_location" integer NOT NULL, "delete_reason" character varying, "user_comment" character varying, "is_printed" integer, "donor_id" integer, "notes" character varying, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "test_id" integer, CONSTRAINT "PK_42afca7f2f2edf6dceaf88d3f16" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "patient_test" ADD CONSTRAINT "FK_899888172a83bd057212716d216" FOREIGN KEY ("test_id") REFERENCES "test"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient_test" DROP CONSTRAINT "FK_899888172a83bd057212716d216"`);
        await queryRunner.query(`DROP TABLE "patient_test"`);
    }

}
