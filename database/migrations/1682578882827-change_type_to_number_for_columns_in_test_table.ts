import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTypeToNumberForColumnsInTestTable1682578882827
  implements MigrationInterface
{
  name = 'ChangeTypeToNumberForColumnsInTestTable1682578882827';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "test" RENAME COLUMN "reports_template" TO "report_template"`,
    );
    await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "report_template"`);
    await queryRunner.query(`ALTER TABLE "test" ADD "report_template" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "report_template"`);
    await queryRunner.query(
      `ALTER TABLE "test" ADD "report_template" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "test" RENAME COLUMN "report_template" TO "reports_template"`,
    );
  }
}
