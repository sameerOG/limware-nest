import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetDefaultNull1682682073165 implements MigrationInterface {
  name = 'SetDefaultNull1682682073165';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "test_parameter" ALTER COLUMN "pl_tp_id" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "test_parameter" ALTER COLUMN "pl_tp_id" SET NOT NULL`,
    );
  }
}
