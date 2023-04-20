import { MigrationInterface, QueryRunner } from 'typeorm';

export class SoftdeleteLaboratory1681977168379 implements MigrationInterface {
  name = 'SoftdeleteLaboratory1681977168379';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "laboratory" ADD "deleted_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "laboratory" DROP COLUMN "deleted_at"`,
    );
  }
}
