import { MigrationInterface, QueryRunner } from 'typeorm';

export class SoftdeleteEmailTemplate1681895526259
  implements MigrationInterface
{
  name = 'SoftdeleteEmailTemplate1681895526259';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email_template" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_template" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_template" ADD "deleted_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email_template" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_template" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_template" DROP COLUMN "created_at"`,
    );
  }
}
