import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTypeToStringTestGroupParentIdCol1682681788082
  implements MigrationInterface
{
  name = 'ChangeTypeToStringTestGroupParentIdCol1682681788082';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test_group" DROP COLUMN "parent_id"`);
    await queryRunner.query(
      `ALTER TABLE "test_group" ADD "parent_id" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test_group" DROP COLUMN "parent_id"`);
    await queryRunner.query(
      `ALTER TABLE "test_group" ADD "parent_id" integer NOT NULL`,
    );
  }
}
