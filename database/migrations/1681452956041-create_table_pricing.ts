import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablePricing1681452956041 implements MigrationInterface {
    name = 'CreateTablePricing1681452956041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment_transaction" ("_id" SERIAL NOT NULL, "name" character varying NOT NULL, "title" character varying NOT NULL, "is_published" boolean NOT NULL, "plan_for" character varying NOT NULL, "plan_type" character varying NOT NULL, "packages" character varying NOT NULL, "trial_days" integer, "unit_price" double precision, "discount" double precision, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_afa158f02359c2e6a1f2e306d02" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "pricing_plan" ("_id" SERIAL NOT NULL, "name" character varying NOT NULL, "title" character varying NOT NULL, "is_published" boolean NOT NULL, "plan_for" character varying NOT NULL, "plan_type" character varying NOT NULL, "packages" character varying NOT NULL, "trial_days" integer, "unit_price" double precision, "discount" double precision, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6505f20b926235e6ea63e98bed2" PRIMARY KEY ("_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "pricing_plan"`);
        await queryRunner.query(`DROP TABLE "payment_transaction"`);
    }

}
