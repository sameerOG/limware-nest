import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTypeForTransactionTable1685598388707
  implements MigrationInterface
{
  name = 'ChangeTypeForTransactionTable1685598388707';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "type" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "payment_method"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "payment_method" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "payment_method"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "payment_method" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "type" character varying NOT NULL`,
    );
  }
}
