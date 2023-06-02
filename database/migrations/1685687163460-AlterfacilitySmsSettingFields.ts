import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterfacilitySmsSettingFields1685687163460 implements MigrationInterface {
    name = 'AlterfacilitySmsSettingFields1685687163460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facility_sms_setting" DROP COLUMN "employee_id"`);
        await queryRunner.query(`ALTER TABLE "facility_sms_setting" ADD "employee_id" integer`);
        await queryRunner.query(`ALTER TABLE "facility_sms_setting" DROP COLUMN "employee_id"`);
        await queryRunner.query(`ALTER TABLE "facility_sms_setting" ADD "employee_id" character varying`);
        await queryRunner.query(`ALTER TABLE "facility_sms_setting" DROP COLUMN "facility_id"`);
        await queryRunner.query(`ALTER TABLE "facility_sms_setting" ADD "facility_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facility_sms_setting" DROP COLUMN "facility_id"`);
        await queryRunner.query(`ALTER TABLE "facility_sms_setting" ADD "facility_id" integer`);
        await queryRunner.query(`ALTER TABLE "facility_sms_setting" DROP COLUMN "employee_id"`);
        await queryRunner.query(`ALTER TABLE "facility_sms_setting" ADD "employee_id" integer`);
        await queryRunner.query(`ALTER TABLE "facility_sms_setting" DROP COLUMN "employee_id"`);
        await queryRunner.query(`ALTER TABLE "facility_sms_setting" ADD "employee_id" character varying`);
    }

}
