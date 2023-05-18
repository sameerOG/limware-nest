import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRelationsInDepartment1684403731458
  implements MigrationInterface
{
  name = 'ChangeRelationsInDepartment1684403731458';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "department" DROP CONSTRAINT "FK_64363fe69958a5be1f06758b549"`,
    );
    await queryRunner.query(
      `ALTER TABLE "department" DROP CONSTRAINT "FK_110d56d702b0880fe9b005878e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "department" DROP CONSTRAINT "UQ_64363fe69958a5be1f06758b549"`,
    );
    await queryRunner.query(
      `ALTER TABLE "department" DROP CONSTRAINT "UQ_110d56d702b0880fe9b005878e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "department" ADD CONSTRAINT "FK_64363fe69958a5be1f06758b549" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "department" ADD CONSTRAINT "FK_110d56d702b0880fe9b005878e9" FOREIGN KEY ("parent_id") REFERENCES "laboratory"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "department" DROP CONSTRAINT "FK_110d56d702b0880fe9b005878e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "department" DROP CONSTRAINT "FK_64363fe69958a5be1f06758b549"`,
    );
    await queryRunner.query(
      `ALTER TABLE "department" ADD CONSTRAINT "UQ_110d56d702b0880fe9b005878e9" UNIQUE ("parent_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "department" ADD CONSTRAINT "UQ_64363fe69958a5be1f06758b549" UNIQUE ("facility_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "department" ADD CONSTRAINT "FK_110d56d702b0880fe9b005878e9" FOREIGN KEY ("parent_id") REFERENCES "laboratory"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "department" ADD CONSTRAINT "FK_64363fe69958a5be1f06758b549" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
