import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLabTestRateListId1685534095218
  implements MigrationInterface
{
  name = 'CreateLabTestRateListId1685534095218';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" ADD "lab_test_rate_list_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" ADD CONSTRAINT "FK_1fa970c8a28898b7c825f90f5d7" FOREIGN KEY ("lab_test_rate_list_id") REFERENCES "lab_test_rate_list"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" DROP CONSTRAINT "FK_1fa970c8a28898b7c825f90f5d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" DROP COLUMN "lab_test_rate_list_id"`,
    );
  }
}
