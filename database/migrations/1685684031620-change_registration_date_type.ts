import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRegistrationDateType1685684031620
  implements MigrationInterface
{
  name = 'ChangeRegistrationDateType1685684031620';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient" DROP COLUMN "registration_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD "registration_date" bigint`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient" DROP COLUMN "registration_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD "registration_date" character varying`,
    );
  }
}
