import { MigrationInterface, QueryRunner } from 'typeorm';

export class SoftdeleteColumnsForCustomer1681813420837
  implements MigrationInterface
{
  name = 'SoftdeleteColumnsForCustomer1681813420837';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "customer" ADD "deletedAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "deletedAt"`);
  }
}
