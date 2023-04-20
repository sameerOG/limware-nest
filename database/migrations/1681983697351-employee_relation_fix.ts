import { MigrationInterface, QueryRunner } from 'typeorm';

export class EmployeeRelationFix1681983697351 implements MigrationInterface {
  name = 'EmployeeRelationFix1681983697351';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee" DROP CONSTRAINT "FK_f153a813d149a32e6187ae26594"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" DROP CONSTRAINT "FK_06d129015f87cc68656ee211d45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" DROP CONSTRAINT "UQ_f153a813d149a32e6187ae26594"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" DROP CONSTRAINT "UQ_06d129015f87cc68656ee211d45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD CONSTRAINT "FK_f153a813d149a32e6187ae26594" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD CONSTRAINT "FK_06d129015f87cc68656ee211d45" FOREIGN KEY ("customer_id") REFERENCES "customer"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee" DROP CONSTRAINT "FK_06d129015f87cc68656ee211d45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" DROP CONSTRAINT "FK_f153a813d149a32e6187ae26594"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD CONSTRAINT "UQ_06d129015f87cc68656ee211d45" UNIQUE ("customer_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD CONSTRAINT "UQ_f153a813d149a32e6187ae26594" UNIQUE ("facility_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD CONSTRAINT "FK_06d129015f87cc68656ee211d45" FOREIGN KEY ("customer_id") REFERENCES "customer"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD CONSTRAINT "FK_f153a813d149a32e6187ae26594" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
