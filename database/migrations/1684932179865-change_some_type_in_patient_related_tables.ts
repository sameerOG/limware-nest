import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeSomeTypeInPatientRelatedTables1684932179865
  implements MigrationInterface
{
  name = 'ChangeSomeTypeInPatientRelatedTables1684932179865';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_account" DROP COLUMN "parent_facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_account" ADD "parent_facility_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_account" DROP COLUMN "registration_facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_account" ADD "registration_facility_id" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "facility_id"`);
    await queryRunner.query(
      `ALTER TABLE "patient" ADD "facility_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" DROP COLUMN "cc_facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD "cc_facility_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test_parameter_result" DROP COLUMN "facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test_parameter_result" ADD "facility_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test_parameter_result" DROP COLUMN "laboratory_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test_parameter_result" ADD "laboratory_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" DROP COLUMN "facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" ADD "facility_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" DROP COLUMN "laboratory_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" ADD "laboratory_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" DROP COLUMN "patient_account_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" ADD "patient_account_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" DROP COLUMN "patient_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" ADD "patient_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" DROP COLUMN "appointment_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" ADD "appointment_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" DROP COLUMN "test_category_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" ADD "test_category_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" DROP COLUMN "donor_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" ADD "donor_id" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_test" DROP COLUMN "donor_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" ADD "donor_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" DROP COLUMN "test_category_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" ADD "test_category_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" DROP COLUMN "appointment_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" ADD "appointment_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" DROP COLUMN "patient_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" ADD "patient_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" DROP COLUMN "patient_account_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" ADD "patient_account_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" DROP COLUMN "laboratory_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" ADD "laboratory_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" DROP COLUMN "facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" ADD "facility_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test_parameter_result" DROP COLUMN "laboratory_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test_parameter_result" ADD "laboratory_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test_parameter_result" DROP COLUMN "facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test_parameter_result" ADD "facility_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" DROP COLUMN "cc_facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD "cc_facility_id" integer`,
    );
    await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "facility_id"`);
    await queryRunner.query(
      `ALTER TABLE "patient" ADD "facility_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_account" DROP COLUMN "registration_facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_account" ADD "registration_facility_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_account" DROP COLUMN "parent_facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_account" ADD "parent_facility_id" integer NOT NULL`,
    );
  }
}
