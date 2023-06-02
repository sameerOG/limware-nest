import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRelationForLabRateList1685533087874
  implements MigrationInterface
{
  name = 'ChangeRelationForLabRateList1685533087874';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list" DROP CONSTRAINT "FK_7aaa79d2daa50a2d63aedbee25b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list" DROP CONSTRAINT "FK_88dda7c0533c8c5fa5d6cba2768"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list" DROP CONSTRAINT "UQ_7aaa79d2daa50a2d63aedbee25b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list" DROP CONSTRAINT "UQ_88dda7c0533c8c5fa5d6cba2768"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" DROP CONSTRAINT "FK_21ef59121bcd745e6626eb5a48a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" DROP CONSTRAINT "FK_14ee55caf371e2f3e9f67ef17a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" DROP CONSTRAINT "UQ_21ef59121bcd745e6626eb5a48a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" DROP CONSTRAINT "UQ_14ee55caf371e2f3e9f67ef17a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list" ADD CONSTRAINT "FK_7aaa79d2daa50a2d63aedbee25b" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list" ADD CONSTRAINT "FK_88dda7c0533c8c5fa5d6cba2768" FOREIGN KEY ("laboratory_id") REFERENCES "laboratory"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" ADD CONSTRAINT "FK_21ef59121bcd745e6626eb5a48a" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" ADD CONSTRAINT "FK_14ee55caf371e2f3e9f67ef17a0" FOREIGN KEY ("laboratory_id") REFERENCES "laboratory"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" DROP CONSTRAINT "FK_14ee55caf371e2f3e9f67ef17a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" DROP CONSTRAINT "FK_21ef59121bcd745e6626eb5a48a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list" DROP CONSTRAINT "FK_88dda7c0533c8c5fa5d6cba2768"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list" DROP CONSTRAINT "FK_7aaa79d2daa50a2d63aedbee25b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" ADD CONSTRAINT "UQ_14ee55caf371e2f3e9f67ef17a0" UNIQUE ("laboratory_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" ADD CONSTRAINT "UQ_21ef59121bcd745e6626eb5a48a" UNIQUE ("facility_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" ADD CONSTRAINT "FK_14ee55caf371e2f3e9f67ef17a0" FOREIGN KEY ("laboratory_id") REFERENCES "laboratory"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" ADD CONSTRAINT "FK_21ef59121bcd745e6626eb5a48a" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list" ADD CONSTRAINT "UQ_88dda7c0533c8c5fa5d6cba2768" UNIQUE ("laboratory_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list" ADD CONSTRAINT "UQ_7aaa79d2daa50a2d63aedbee25b" UNIQUE ("facility_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list" ADD CONSTRAINT "FK_88dda7c0533c8c5fa5d6cba2768" FOREIGN KEY ("laboratory_id") REFERENCES "laboratory"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list" ADD CONSTRAINT "FK_7aaa79d2daa50a2d63aedbee25b" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
