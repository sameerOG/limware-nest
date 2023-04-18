import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablePatientAccount1681450669355 implements MigrationInterface {
    name = 'CreateTablePatientAccount1681450669355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "patient_account" ("_id" SERIAL NOT NULL, "parent_facility_id" integer NOT NULL, "registration_facility_id" integer NOT NULL, "unique_id" character varying NOT NULL, "mobile_number" character varying NOT NULL, "phone_number" character varying, "other_contacts" character varying NOT NULL, "name" character varying NOT NULL, "gender" character varying NOT NULL, "cnic" character varying, "email" character varying, "dob" TIMESTAMP, "guardian_info" character varying, "address" character varying, "city" character varying, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_02cd44a26abd05c0aae9592ae28" UNIQUE ("unique_id"), CONSTRAINT "PK_9db3de828a08348d093c0f523f7" PRIMARY KEY ("_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "patient_account"`);
    }

}
