import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableInvoiceLineItem1681449871992 implements MigrationInterface {
    name = 'CreateTableInvoiceLineItem1681449871992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "invoice_line_item" ("_id" SERIAL NOT NULL, "facility_id" integer NOT NULL, "test_id" integer, "title" character varying NOT NULL, "amount" double precision NOT NULL, "remarks" character varying, "delete_reason" character varying, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "invoice_id" integer, CONSTRAINT "PK_3d0cb0c9681d8803a1df844abb6" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "invoice_line_item" ADD CONSTRAINT "FK_706938143f41efb24ffb55d6d8f" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_line_item" DROP CONSTRAINT "FK_706938143f41efb24ffb55d6d8f"`);
        await queryRunner.query(`DROP TABLE "invoice_line_item"`);
    }

}
