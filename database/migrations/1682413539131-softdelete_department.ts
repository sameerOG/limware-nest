import { MigrationInterface, QueryRunner } from 'typeorm';

export class SoftdeleteDepartment1682413539131 implements MigrationInterface {
  name = 'SoftdeleteDepartment1682413539131';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "department" ADD "deleted_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "department" DROP COLUMN "deleted_at"`,
    );
  }
}
