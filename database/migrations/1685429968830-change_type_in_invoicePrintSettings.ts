import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTypeInInvoicePrintSettings1685429968830
  implements MigrationInterface
{
  name = 'ChangeTypeInInvoicePrintSettings1685429968830';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice_print_settings" DROP COLUMN "laboratory_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_print_settings" ADD "laboratory_id" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice_print_settings" DROP COLUMN "laboratory_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_print_settings" ADD "laboratory_id" integer NOT NULL`,
    );
  }
}
