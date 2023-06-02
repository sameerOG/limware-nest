import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterInvoiceSettingTable1685605158609 implements MigrationInterface {
    name = 'AlterInvoiceSettingTable1685605158609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_print_settings" DROP COLUMN "laboratory_id"`);
        await queryRunner.query(`ALTER TABLE "invoice_print_settings" ADD "laboratory_id" character varying NOT NULL`);    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_print_settings" DROP COLUMN "laboratory_id"`);
        await queryRunner.query(`ALTER TABLE "invoice_print_settings" ADD "laboratory_id" integer NOT NULL`);
    }

}
