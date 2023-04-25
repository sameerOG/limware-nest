import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeFacilityIdTypeInAddons1682402427033
  implements MigrationInterface
{
  name = 'ChangeFacilityIdTypeInAddons1682402427033';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "addons" DROP COLUMN "facility_id"`);
    await queryRunner.query(
      `ALTER TABLE "addons" ADD "facility_id" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "addons" DROP COLUMN "facility_id"`);
    await queryRunner.query(
      `ALTER TABLE "addons" ADD "facility_id" integer NOT NULL`,
    );
  }
}
