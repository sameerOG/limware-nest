import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1681445989033 implements MigrationInterface {
    name = 'CreateTables1681445989033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_print_settings" DROP CONSTRAINT "FK_a13c6bb15389d67fc024d0bd4ee"`);
        await queryRunner.query(`CREATE TABLE "addons" ("_id" SERIAL NOT NULL, "facility_id" integer NOT NULL, "sms" json, "whatsapp" json, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f0b02b64aca8a82f0f350dd9d40" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "app_feature" ("_id" SERIAL NOT NULL, "method" character varying NOT NULL, "parent_id" integer, "title" character varying, "operation" character varying NOT NULL, "description" character varying, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_96b663a04b6248817376fdc8d01" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "configuration" ("_id" SERIAL NOT NULL, "conf_key" character varying NOT NULL, "conf_value" character varying NOT NULL, "title" character varying NOT NULL, "is_single" boolean NOT NULL, "type" character varying, "description" character varying, "facility_id" integer, "lab_id" integer, "hc_id" integer, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4c411949e95ab36855b5e340c32" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "configuration_option" ("_id" SERIAL NOT NULL, "conf_key" character varying NOT NULL, "conf_value" character varying NOT NULL, "title" character varying NOT NULL, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "configuration_id" integer, CONSTRAINT "PK_b61a43223985ca88255ea061d7a" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "user_mapping" ("_id" SERIAL NOT NULL, "user_id" integer NOT NULL, "facility_id" integer NOT NULL, "role_ids" character varying, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "laboratory_id" integer, CONSTRAINT "PK_6e0fcc8e4569b65811f842a949b" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "employee_facility" ("_id" SERIAL NOT NULL, "role_ids" character varying NOT NULL, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "employee_id" integer, "facility_id" integer, CONSTRAINT "PK_38c68728ea3766b3d172dacc238" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "laboratory_setting" ("_id" SERIAL NOT NULL, "facility_id" integer, "laboratory_id" integer NOT NULL, "require_results_for_mark_as_done" boolean NOT NULL, "print_empty_result" boolean NOT NULL, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_183c81daa2532abb0fd8c5d200c" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "report_print_settings" ("_id" SERIAL NOT NULL, "laboratory_id" integer NOT NULL, "margin_top" character varying, "margin_right" character varying, "margin_left" character varying, "margin_bottom" character varying, "header_image_name" character varying, "footer_image_name" character varying, "header_text" character varying, "footer_text" character varying, "default_header_type" character varying, "default_footer_type" character varying, "default_download_header_type" character varying, "default_download_footer_type" character varying, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5d1135a1db6c4551c468cb13eab" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "invoice_print_settings" ALTER COLUMN "logo_image_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoice_print_settings" ALTER COLUMN "laboratory_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoice_print_settings" DROP CONSTRAINT "REL_a13c6bb15389d67fc024d0bd4e"`);
        await queryRunner.query(`ALTER TABLE "configuration_option" ADD CONSTRAINT "FK_bc3404940e445b66a73f30a9411" FOREIGN KEY ("configuration_id") REFERENCES "configuration"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_mapping" ADD CONSTRAINT "FK_50e7bae7f04753fa4732696385d" FOREIGN KEY ("laboratory_id") REFERENCES "laboratory"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_facility" ADD CONSTRAINT "FK_1cb1a01a4d62e882bb83fa4fac6" FOREIGN KEY ("employee_id") REFERENCES "employee"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_facility" ADD CONSTRAINT "FK_d5945de7055623ed8a2752b6594" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_facility" DROP CONSTRAINT "FK_d5945de7055623ed8a2752b6594"`);
        await queryRunner.query(`ALTER TABLE "employee_facility" DROP CONSTRAINT "FK_1cb1a01a4d62e882bb83fa4fac6"`);
        await queryRunner.query(`ALTER TABLE "user_mapping" DROP CONSTRAINT "FK_50e7bae7f04753fa4732696385d"`);
        await queryRunner.query(`ALTER TABLE "configuration_option" DROP CONSTRAINT "FK_bc3404940e445b66a73f30a9411"`);
        await queryRunner.query(`ALTER TABLE "invoice_print_settings" ADD CONSTRAINT "REL_a13c6bb15389d67fc024d0bd4e" UNIQUE ("laboratory_id")`);
        await queryRunner.query(`ALTER TABLE "invoice_print_settings" ALTER COLUMN "laboratory_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoice_print_settings" ALTER COLUMN "logo_image_name" SET NOT NULL`);
        await queryRunner.query(`DROP TABLE "report_print_settings"`);
        await queryRunner.query(`DROP TABLE "laboratory_setting"`);
        await queryRunner.query(`DROP TABLE "employee_facility"`);
        await queryRunner.query(`DROP TABLE "user_mapping"`);
        await queryRunner.query(`DROP TABLE "configuration_option"`);
        await queryRunner.query(`DROP TABLE "configuration"`);
        await queryRunner.query(`DROP TABLE "app_feature"`);
        await queryRunner.query(`DROP TABLE "addons"`);
        await queryRunner.query(`ALTER TABLE "invoice_print_settings" ADD CONSTRAINT "FK_a13c6bb15389d67fc024d0bd4ee" FOREIGN KEY ("laboratory_id") REFERENCES "laboratory"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
