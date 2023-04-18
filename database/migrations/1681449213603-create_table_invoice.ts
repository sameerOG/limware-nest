import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableInvoice1681449213603 implements MigrationInterface {
    name = 'CreateTableInvoice1681449213603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "invoice" ("_id" SERIAL NOT NULL, "facility_id" integer NOT NULL, "patient_account_id" integer, "patient_id" integer NOT NULL, "appointment_id" integer NOT NULL, "invoice_number" integer, "status" integer NOT NULL, "title" character varying NOT NULL, "invoice_date" integer NOT NULL, "description" character varying, "total_amount" double precision NOT NULL, "discount_amount" double precision, "total_payable_amount" double precision NOT NULL, "paid_amount" double precision, "due_amount" double precision, "user_comments" character varying, "activity_log" character varying, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5daf8daca77cd608b70dbde8a5c" PRIMARY KEY ("_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "invoice"`);
    }

}
