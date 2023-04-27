import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTypeToJsonForColumnsInTestTable1682577355064
  implements MigrationInterface
{
  name = 'ChangeTypeToJsonForColumnsInTestTable1682577355064';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "sample_quantity"`);
    await queryRunner.query(`ALTER TABLE "test" ADD "sample_quantity" json`);
    await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "duration"`);
    await queryRunner.query(`ALTER TABLE "test" ADD "duration" json`);
    await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "archived"`);
    await queryRunner.query(
      `ALTER TABLE "test" ADD "archived" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "archived"`);
    await queryRunner.query(
      `ALTER TABLE "test" ADD "archived" character varying NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "duration"`);
    await queryRunner.query(
      `ALTER TABLE "test" ADD "duration" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "sample_quantity"`);
    await queryRunner.query(
      `ALTER TABLE "test" ADD "sample_quantity" character varying`,
    );
  }
}
