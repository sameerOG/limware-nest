import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveNullConstarintLaboratory1681972945126
  implements MigrationInterface
{
  name = 'RemoveNullConstarintLaboratory1681972945126';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "laboratory" ALTER COLUMN "unique_id" DROP NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "laboratory" ALTER COLUMN "contact_numbers" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "laboratory" ALTER COLUMN "unique_id" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "laboratory" ALTER COLUMN "contact_numbers" SET NOT NULL`,
    );
  }
}
