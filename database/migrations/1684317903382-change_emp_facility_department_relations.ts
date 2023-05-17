import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeEmpFacilityDepartmentRelations1684317903382
  implements MigrationInterface
{
  name = 'ChangeEmpFacilityDepartmentRelations1684317903382';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" DROP COLUMN "employee_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" ADD "employee_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" DROP COLUMN "facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" ADD "facility_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" DROP COLUMN "employee_facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" ADD "employee_facility_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" DROP COLUMN "department_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" ADD "department_id" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" DROP COLUMN "department_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" ADD "department_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" DROP COLUMN "employee_facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" ADD "employee_facility_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" DROP COLUMN "facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" ADD "facility_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" DROP COLUMN "employee_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" ADD "employee_id" integer NOT NULL`,
    );
  }
}
