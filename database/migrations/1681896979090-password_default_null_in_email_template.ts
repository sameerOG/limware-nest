import { MigrationInterface, QueryRunner } from 'typeorm';

export class PasswordDefaultNullInEmailTemplate1681896979090
  implements MigrationInterface
{
  name = 'PasswordDefaultNullInEmailTemplate1681896979090';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email_template" ALTER COLUMN "password" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email_template" ALTER COLUMN "password" SET NOT NULL`,
    );
  }
}
