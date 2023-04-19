import { MigrationInterface, QueryRunner } from 'typeorm';

export class SoftdeleteTestCategory1681881585555 implements MigrationInterface {
  name = 'SoftdeleteTestCategory1681881585555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "test_category" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_category" DROP COLUMN "report_template"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_category" ADD "report_template" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "test_category" DROP COLUMN "report_template"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_category" ADD "report_template" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_category" DROP COLUMN "deleted_at"`,
    );
  }
}
