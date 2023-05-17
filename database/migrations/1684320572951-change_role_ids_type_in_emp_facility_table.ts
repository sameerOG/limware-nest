import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRoleIdsTypeInEmpFacilityTable1684320572951
  implements MigrationInterface
{
  name = 'ChangeRoleIdsTypeInEmpFacilityTable1684320572951';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee_facility" DROP COLUMN "role_ids"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility" ADD "role_ids" json NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee_facility" DROP COLUMN "role_ids"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility" ADD "role_ids" character varying NOT NULL`,
    );
  }
}
