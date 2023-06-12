import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeletedAtInvoiceLineItem1686556812507
  implements MigrationInterface
{
  name = 'DeletedAtInvoiceLineItem1686556812507';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice_line_item" ADD "deleted_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice_line_item" DROP COLUMN "deleted_at"`,
    );
  }
}
