import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableAppointment1681468448808 implements MigrationInterface {
    name = 'CreateTableAppointment1681468448808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "appointment" ("_id" SERIAL NOT NULL, "cc_facility_id" integer, "facility_id" integer NOT NULL, "patient_account_id" integer, "type" character varying NOT NULL, "laboratory_id" integer, "doctor_id" character varying, "appointment_number" character varying, "lab_number" character varying NOT NULL, "reference_number" integer, "appointment_date" integer NOT NULL, "appointment_time" character varying, "result_delivery_date" character varying, "result_delivery_time" character varying, "is_completed" boolean NOT NULL DEFAULT false, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "patient_id" integer, "reference_id" integer, CONSTRAINT "UQ_46e3fab0c635f91d9d2b5c815db" UNIQUE ("appointment_number"), CONSTRAINT "UQ_e179de19bd91e0098b59165c40d" UNIQUE ("lab_number"), CONSTRAINT "PK_630da9dc55ad0cdd4e14b407057" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_86b3e35a97e289071b4785a1402" FOREIGN KEY ("patient_id") REFERENCES "patient"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_e6b9cc7f47fc93fdff74786d8eb" FOREIGN KEY ("reference_id") REFERENCES "reference"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_e6b9cc7f47fc93fdff74786d8eb"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_86b3e35a97e289071b4785a1402"`);
        await queryRunner.query(`DROP TABLE "appointment"`);
    }

}
