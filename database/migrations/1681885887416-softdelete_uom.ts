import { MigrationInterface, QueryRunner } from 'typeorm';

export class SoftdeleteUom1681885887416 implements MigrationInterface {
  name = 'SoftdeleteUom1681885887416';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uom" ADD "deleted_at" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "uom" DROP COLUMN "deleted_at"`);
  }
}
