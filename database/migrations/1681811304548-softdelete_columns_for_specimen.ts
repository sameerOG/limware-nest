import { MigrationInterface, QueryRunner } from 'typeorm';

export class SoftdeleteColumnsForSpecimen1681811304548
  implements MigrationInterface
{
  name = 'SoftdeleteColumnsForSpecimen1681811304548';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "specimen" ADD "deletedAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "specimen" DROP COLUMN "deletedAt"`);
  }
}
