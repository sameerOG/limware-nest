import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArchieveColumnInNormalRangeAndTestParametersTable1686546463629
  implements MigrationInterface
{
  name = 'ArchieveColumnInNormalRangeAndTestParametersTable1686546463629';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "test_parameter" ADD "archieved" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_normal_range" ADD "archieved" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "test_normal_range" DROP COLUMN "archieved"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_parameter" DROP COLUMN "archieved"`,
    );
  }
}
