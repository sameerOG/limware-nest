import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableEmployeeFacilityDepartment1681446835037 implements MigrationInterface {
    name = 'CreateTableEmployeeFacilityDepartment1681446835037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "employee_facility_department" ("_id" SERIAL NOT NULL, "employee_id" integer NOT NULL, "facility_id" integer NOT NULL, "employee_facility_id" integer NOT NULL, "department_id" integer NOT NULL, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6327bc25a6bacde29dc9761cd45" PRIMARY KEY ("_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "employee_facility_department"`);
    }

}
