import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetDefaultValues1684932605988 implements MigrationInterface {
  name = 'SetDefaultValues1684932605988';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_account" ALTER COLUMN "unique_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_account" ALTER COLUMN "other_contacts" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_account" ALTER COLUMN "other_contacts" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_account" ALTER COLUMN "unique_id" SET NOT NULL`,
    );
  }
}
