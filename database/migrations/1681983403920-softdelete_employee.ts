import { MigrationInterface, QueryRunner } from 'typeorm';

export class SoftdeleteEmployee1681983403920 implements MigrationInterface {
  name = 'SoftdeleteEmployee1681983403920';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "deleted_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "deleted_at"`);
  }
}
