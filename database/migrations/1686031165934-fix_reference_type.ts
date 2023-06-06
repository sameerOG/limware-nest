import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixReferenceType1686031165934 implements MigrationInterface {
  name = 'FixReferenceType1686031165934';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "reference_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "reference_number" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "reference_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "reference_number" integer`,
    );
  }
}
