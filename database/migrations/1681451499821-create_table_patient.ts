import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablePatient1681451499821 implements MigrationInterface {
    name = 'CreateTablePatient1681451499821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "patient" ("_id" SERIAL NOT NULL, "facility_id" integer NOT NULL, "registration_date" integer, "unique_id" character varying, "cc_facility_id" integer, "mobile_number" character varying, "phone_number" character varying, "other_contacts" character varying, "name" character varying NOT NULL, "age" integer NOT NULL, "age_unit" character varying NOT NULL, "gender" character varying NOT NULL, "cnic" character varying, "email" character varying, "dob" character varying, "guardian_info" character varying, "address" character varying, "city" character varying, "referred_by_self" integer, "referred_by" character varying, "notification_statuses" json, "appointment_info" json, "created_by_name" character varying, "rep_pin" character varying, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "patient_account_id" integer, CONSTRAINT "UQ_301066fb579a153b498d28615dd" UNIQUE ("unique_id"), CONSTRAINT "PK_3374f75ba665bbd5fa32f1091a2" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "FK_4de4dd7953d19be8697be3f0f2b" FOREIGN KEY ("patient_account_id") REFERENCES "patient_account"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "FK_4de4dd7953d19be8697be3f0f2b"`);
        await queryRunner.query(`DROP TABLE "patient"`);
    }

}
