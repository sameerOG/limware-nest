import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeletedAtColumnInMultipleTables1685615735984
  implements MigrationInterface
{
  name = 'DeletedAtColumnInMultipleTables1685615735984';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "patient" ADD "deleted_at" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "patient_test" ADD "deleted_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_test" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "deleted_at"`);
  }
}
