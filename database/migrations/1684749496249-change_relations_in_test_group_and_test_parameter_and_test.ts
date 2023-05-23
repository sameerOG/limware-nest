import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRelationsInTestGroupAndTestParameterAndTest1684749496249
  implements MigrationInterface
{
  name = 'ChangeRelationsInTestGroupAndTestParameterAndTest1684749496249';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "test_group" DROP COLUMN "facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_group" ADD "facility_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_parameter" DROP COLUMN "facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_parameter" ADD "facility_id" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "parent_test_id"`);
    await queryRunner.query(
      `ALTER TABLE "test" ADD "parent_test_id" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "parent_test_id"`);
    await queryRunner.query(`ALTER TABLE "test" ADD "parent_test_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "test_parameter" DROP COLUMN "facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_parameter" ADD "facility_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_group" DROP COLUMN "facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_group" ADD "facility_id" integer`,
    );
  }
}
