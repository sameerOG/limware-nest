import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeletedAtColumnInReferences1686035932677
  implements MigrationInterface
{
  name = 'DeletedAtColumnInReferences1686035932677';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reference" ADD "deleted_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reference" DROP COLUMN "deleted_at"`);
  }
}
