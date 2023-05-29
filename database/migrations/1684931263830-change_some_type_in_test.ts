import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeSomeTypeInTest1684931263830 implements MigrationInterface {
  name = 'ChangeSomeTypeInTest1684931263830';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "facility_id"`);
    await queryRunner.query(
      `ALTER TABLE "test" ADD "facility_id" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "facility_id"`);
    await queryRunner.query(`ALTER TABLE "test" ADD "facility_id" integer`);
  }
}
