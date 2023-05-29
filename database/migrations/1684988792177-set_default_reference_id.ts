import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetDefaultReferenceId1684988792177 implements MigrationInterface {
  name = 'SetDefaultReferenceId1684988792177';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_e6b9cc7f47fc93fdff74786d8eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "reference_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "reference_id" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "reference_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "reference_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_e6b9cc7f47fc93fdff74786d8eb" FOREIGN KEY ("reference_id") REFERENCES "reference"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
