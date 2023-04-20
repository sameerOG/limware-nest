import { MigrationInterface, QueryRunner } from 'typeorm';

export class SoftdeleteFacility1681967262208 implements MigrationInterface {
  name = 'SoftdeleteFacility1681967262208';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "facility" ADD "deleted_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "facility" DROP COLUMN "deleted_at"`);
  }
}
