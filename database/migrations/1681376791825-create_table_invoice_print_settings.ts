import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableInvoicePrintSettings1681376791825 implements MigrationInterface {
    name = 'CreateTableInvoicePrintSettings1681376791825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "invoice_print_settings" ("_id" SERIAL NOT NULL, "logo_image_name" character varying NOT NULL, "footer_text" character varying, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "laboratory_id" integer, CONSTRAINT "REL_a13c6bb15389d67fc024d0bd4e" UNIQUE ("laboratory_id"), CONSTRAINT "PK_77d9fd67ad056ad48d7af27a7ae" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "invoice_print_settings" ADD CONSTRAINT "FK_a13c6bb15389d67fc024d0bd4ee" FOREIGN KEY ("laboratory_id") REFERENCES "laboratory"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_print_settings" DROP CONSTRAINT "FK_a13c6bb15389d67fc024d0bd4ee"`);
        await queryRunner.query(`DROP TABLE "invoice_print_settings"`);
    }

}
