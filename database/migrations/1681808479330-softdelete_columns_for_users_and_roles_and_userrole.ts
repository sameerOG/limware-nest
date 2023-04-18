import { MigrationInterface, QueryRunner } from 'typeorm';

export class SoftdeleteColumnsForUsersAndRolesAndUserrole1681808479330
  implements MigrationInterface
{
  name = 'SoftdeleteColumnsForUsersAndRolesAndUserrole1681808479330';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "user_role" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "deletedAt"`);
  }
}
