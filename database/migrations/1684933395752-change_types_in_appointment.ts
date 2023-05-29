import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTypesInAppointment1684933395752
  implements MigrationInterface
{
  name = 'ChangeTypesInAppointment1684933395752';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient" DROP COLUMN "registration_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD "registration_date" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "cc_facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "cc_facility_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "facility_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "patient_account_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "patient_account_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "laboratory_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "laboratory_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "appointment_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "appointment_date" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "invoice_date"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "invoice_date" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "invoice_date"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "invoice_date" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "appointment_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "appointment_date" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "laboratory_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "laboratory_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "patient_account_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "patient_account_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "facility_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "cc_facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "cc_facility_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" DROP COLUMN "registration_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD "registration_date" integer`,
    );
  }
}
