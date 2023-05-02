import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableFacility1681362789808 implements MigrationInterface {
    name = 'CreateTableFacility1681362789808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "facility" ("_id" SERIAL NOT NULL, "name" character varying, "unique_id" character varying, "email" character varying, "mobile_number" character varying, "phone_number" character varying, "contact_numbers" json, "address" character varying, "city" character varying, "status" integer, "type" character varying, "facility_image_name" character varying, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "parent_facility_id" integer, "customer_id" integer, CONSTRAINT "UQ_dd1e9c8744252c8c0929bdb33c1" UNIQUE ("unique_id"), CONSTRAINT "REL_1b6ddffdccd5da2e71e2a7239c" UNIQUE ("parent_facility_id"), CONSTRAINT "REL_61198782511b0323d5cc50974b" UNIQUE ("customer_id"), CONSTRAINT "PK_c193bfff62a6a34c493d5d36d8c" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "facility_id" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_1462295d0650df0f1ca78416a34" UNIQUE ("facility_id")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_1462295d0650df0f1ca78416a34" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "facility" ADD CONSTRAINT "FK_1b6ddffdccd5da2e71e2a7239c3" FOREIGN KEY ("parent_facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "facility" ADD CONSTRAINT "FK_61198782511b0323d5cc50974be" FOREIGN KEY ("customer_id") REFERENCES "customer"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facility" DROP CONSTRAINT "FK_61198782511b0323d5cc50974be"`);
        await queryRunner.query(`ALTER TABLE "facility" DROP CONSTRAINT "FK_1b6ddffdccd5da2e71e2a7239c3"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_1462295d0650df0f1ca78416a34"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_1462295d0650df0f1ca78416a34"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "facility_id"`);
        await queryRunner.query(`DROP TABLE "facility"`);
    }

}
