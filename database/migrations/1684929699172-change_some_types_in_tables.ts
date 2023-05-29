import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeSomeTypesInTables1684929699172
  implements MigrationInterface
{
  name = 'ChangeSomeTypesInTables1684929699172';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "facility_id"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "facility_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN "patient_account_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "patient_account_id" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "patient_id"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "patient_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN "appointment_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "appointment_id" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN "appointment_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "appointment_id" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "patient_id"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "patient_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN "patient_account_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "patient_account_id" integer`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "facility_id"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "facility_id" integer NOT NULL`,
    );
  }
}
