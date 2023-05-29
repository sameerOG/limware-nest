import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeAppointmentColTypes1684988996592
  implements MigrationInterface
{
  name = 'ChangeAppointmentColTypes1684988996592';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "type"`);
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "type" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ALTER COLUMN "lab_number" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointment" ALTER COLUMN "lab_number" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "type"`);
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "type" character varying NOT NULL`,
    );
  }
}
