import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueConstraintRemoveFromEmailInUsers1686315204666
  implements MigrationInterface
{
  name = 'UniqueConstraintRemoveFromEmailInUsers1686315204666';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`,
    );
  }
}
