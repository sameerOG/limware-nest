import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeInvoiceLineItemTypes1684990953678
  implements MigrationInterface
{
  name = 'ChangeInvoiceLineItemTypes1684990953678';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "plan_for"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "discount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "title"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "packages"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "unit_price"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "is_published"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "plan_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "trial_days"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "facility_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "invoice_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "transaction_number" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "type" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "payment_method" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "user_comment" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "amount" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_line_item" DROP COLUMN "facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_line_item" ADD "facility_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_line_item" DROP COLUMN "test_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_line_item" ADD "test_id" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice_line_item" DROP COLUMN "test_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_line_item" ADD "test_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_line_item" DROP COLUMN "facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_line_item" ADD "facility_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "mobile_number" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "amount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "user_comment"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "payment_method"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "transaction_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "invoice_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "trial_days" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "plan_type" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "is_published" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "unit_price" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "packages" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "title" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "discount" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "plan_for" character varying NOT NULL`,
    );
  }
}
