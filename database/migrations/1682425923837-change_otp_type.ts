import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeOtpType1682425923837 implements MigrationInterface {
  name = 'ChangeOtpType1682425923837';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "otp"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "otp" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "otp"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "otp" integer`);
  }
}
