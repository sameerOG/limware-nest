import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableFacilitySmsSetting1681448394839 implements MigrationInterface {
    name = 'CreateTableFacilitySmsSetting1681448394839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "facility_sms_setting" ("_id" SERIAL NOT NULL, "employee_id" integer, "facility_id" integer, "registration_sms" character varying, "registration_sms_status" boolean, "payment_done_sms" character varying, "payment_done_sms_status" boolean, "reports_done_sms" character varying, "reports_done_sms_status" boolean, "reports_done_and_payment_pending_sms" character varying, "reports_done_and_payment_pending_sms_status" boolean, "registration_whatsapp" character varying, "registration_whatsapp_status" boolean, "payment_done_whatsapp" character varying, "payment_done_whatsapp_status" boolean, "reports_done_whatsapp" character varying, "reports_done_whatsapp_status" boolean, "reports_done_and_payment_pending_whatsapp" character varying, "reports_done_and_payment_pending_whatsapp_status" boolean, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_086ddab5122bf37982d3829d7ee" PRIMARY KEY ("_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "facility_sms_setting"`);
    }

}
