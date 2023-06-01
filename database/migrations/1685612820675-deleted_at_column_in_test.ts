import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeletedAtColumnInTest1685612820675 implements MigrationInterface {
  name = 'DeletedAtColumnInTest1685612820675';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test" ADD "deleted_at" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "deleted_at"`);
  }
}
