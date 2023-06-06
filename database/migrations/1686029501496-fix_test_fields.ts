import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixTestFields1686029501496 implements MigrationInterface {
  name = 'FixTestFields1686029501496';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "test" DROP COLUMN "res_input_options"`,
    );
    await queryRunner.query(`ALTER TABLE "test" ADD "res_input_options" json`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "test" DROP COLUMN "res_input_options"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test" ADD "res_input_options" character varying`,
    );
  }
}
