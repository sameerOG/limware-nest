import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablePatientTestParameterResult1681465348340 implements MigrationInterface {
    name = 'CreateTablePatientTestParameterResult1681465348340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "patient_test_parameter_result" ("_id" SERIAL NOT NULL, "facility_id" integer NOT NULL, "laboratory_id" integer NOT NULL, "result" character varying, "widal_result" character varying NOT NULL, "is_abnormal" boolean NOT NULL DEFAULT false, "normal_ranges_ids" character varying NOT NULL, "status" integer NOT NULL, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "test_id" integer, "patient_test_id" integer, "test_parameter_id" integer, CONSTRAINT "PK_ba1c04ff8ca20db06f7c3e6d34b" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "patient_test_parameter_result" ADD CONSTRAINT "FK_c45c67f5e4caccfd02a6d564d90" FOREIGN KEY ("test_id") REFERENCES "test"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient_test_parameter_result" ADD CONSTRAINT "FK_dcd56c73b1acb5fa29b58c76c08" FOREIGN KEY ("patient_test_id") REFERENCES "patient_test"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient_test_parameter_result" ADD CONSTRAINT "FK_07fd4f72bb239dfdfce3b923728" FOREIGN KEY ("test_parameter_id") REFERENCES "test_parameter"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient_test_parameter_result" DROP CONSTRAINT "FK_07fd4f72bb239dfdfce3b923728"`);
        await queryRunner.query(`ALTER TABLE "patient_test_parameter_result" DROP CONSTRAINT "FK_dcd56c73b1acb5fa29b58c76c08"`);
        await queryRunner.query(`ALTER TABLE "patient_test_parameter_result" DROP CONSTRAINT "FK_c45c67f5e4caccfd02a6d564d90"`);
        await queryRunner.query(`DROP TABLE "patient_test_parameter_result"`);
    }

}
