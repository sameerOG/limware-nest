import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableReportPrintSetting1685536318780 implements MigrationInterface {
    name = 'AlterTableReportPrintSetting1685536318780'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_print_settings" DROP COLUMN "laboratory_id"`);
        await queryRunner.query(`ALTER TABLE "report_print_settings" ADD "laboratory_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_print_settings" DROP COLUMN "laboratory_id"`);
        await queryRunner.query(`ALTER TABLE "report_print_settings" ADD "laboratory_id" integer NOT NULL`);
    }

}
