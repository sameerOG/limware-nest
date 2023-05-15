import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeColTypeInReference1683094562355
  implements MigrationInterface
{
  name = 'ChangeColTypeInReference1683094562355';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reference" DROP COLUMN "facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reference" ADD "facility_id" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user_mapping" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_mapping" ADD "user_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_mapping" ADD CONSTRAINT "FK_7c72daad218d3217d5296ea91d9" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_mapping" DROP CONSTRAINT "FK_7c72daad218d3217d5296ea91d9"`,
    );
    await queryRunner.query(`ALTER TABLE "user_mapping" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_mapping" ADD "user_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reference" DROP COLUMN "facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reference" ADD "facility_id" integer NOT NULL`,
    );
  }
}
