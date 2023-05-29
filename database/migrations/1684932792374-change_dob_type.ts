import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeDobType1684932792374 implements MigrationInterface {
  name = 'ChangeDobType1684932792374';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "patient_account" DROP COLUMN "dob"`);
    await queryRunner.query(
      `ALTER TABLE "patient_account" ADD "dob" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "patient_account" DROP COLUMN "dob"`);
    await queryRunner.query(
      `ALTER TABLE "patient_account" ADD "dob" TIMESTAMP`,
    );
  }
}
