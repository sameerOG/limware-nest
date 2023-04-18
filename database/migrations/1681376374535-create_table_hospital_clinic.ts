import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableHospitalClinic1681376374535 implements MigrationInterface {
    name = 'CreateTableHospitalClinic1681376374535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hospital_clinic" ("_id" SERIAL NOT NULL, "name" character varying NOT NULL, "logo_file" character varying, "email" character varying, "state" character varying, "contact_numbers" json NOT NULL, "address" character varying NOT NULL, "city" character varying, "status" integer, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "facility_id" integer, "customer_id" integer, CONSTRAINT "REL_c11fb16125e1459233957096dd" UNIQUE ("facility_id"), CONSTRAINT "REL_33d4d3c7a04e87fc0b8dc221ff" UNIQUE ("customer_id"), CONSTRAINT "PK_1b4a57e6368202d70a8003ef280" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "hospital_clinic" ADD CONSTRAINT "FK_c11fb16125e1459233957096dd9" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hospital_clinic" ADD CONSTRAINT "FK_33d4d3c7a04e87fc0b8dc221ff4" FOREIGN KEY ("customer_id") REFERENCES "customer"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hospital_clinic" DROP CONSTRAINT "FK_33d4d3c7a04e87fc0b8dc221ff4"`);
        await queryRunner.query(`ALTER TABLE "hospital_clinic" DROP CONSTRAINT "FK_c11fb16125e1459233957096dd9"`);
        await queryRunner.query(`DROP TABLE "hospital_clinic"`);
    }

}
