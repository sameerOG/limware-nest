import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeDateColumnNames1681801123643 implements MigrationInterface {
  name = 'ChangeDateColumnNames1681801123643';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "app_feature" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app_feature" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_account" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_account" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "date_created"`);
    await queryRunner.query(
      `ALTER TABLE "patient" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reference" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reference" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuration_option" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuration_option" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuration" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuration" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(`ALTER TABLE "donor" DROP COLUMN "date_modified"`);
    await queryRunner.query(`ALTER TABLE "donor" DROP COLUMN "date_created"`);
    await queryRunner.query(
      `ALTER TABLE "invoice_print_settings" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_print_settings" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_group" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_group" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_parameter" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_parameter" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test_parameter_result" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test_parameter_result" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specimen" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specimen" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(`ALTER TABLE "uom" DROP COLUMN "date_created"`);
    await queryRunner.query(`ALTER TABLE "uom" DROP COLUMN "date_modified"`);
    await queryRunner.query(
      `ALTER TABLE "test_category" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_category" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_normal_range" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_normal_range" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "date_created"`);
    await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "date_modified"`);
    await queryRunner.query(
      `ALTER TABLE "user_mapping" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_mapping" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratory" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratory" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_access_token" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_access_token" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "date_created"`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "date_modified"`);
    await queryRunner.query(
      `ALTER TABLE "department" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "department" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital_clinic" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital_clinic" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(`ALTER TABLE "addons" DROP COLUMN "date_modified"`);
    await queryRunner.query(`ALTER TABLE "addons" DROP COLUMN "date_created"`);
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility_sms_setting" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility_sms_setting" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "date_created"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_line_item" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_line_item" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratory_setting" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratory_setting" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pricing_plan" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pricing_plan" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_print_settings" DROP COLUMN "date_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_print_settings" DROP COLUMN "date_modified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app_feature" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "app_feature" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_account" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_account" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "reference" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "reference" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuration_option" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuration_option" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuration" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuration" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "donor" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "donor" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_print_settings" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_print_settings" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_group" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_group" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_parameter" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_parameter" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test_parameter_result" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test_parameter_result" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "specimen" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "specimen" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "uom" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "uom" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_category" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_category" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_normal_range" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_normal_range" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_mapping" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_mapping" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratory" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratory" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_access_token" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_access_token" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "department" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "department" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital_clinic" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital_clinic" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "addons" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "addons" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility_sms_setting" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility_sms_setting" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_line_item" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_line_item" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratory_setting" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratory_setting" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "pricing_plan" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "pricing_plan" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_print_settings" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_print_settings" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "report_print_settings" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_print_settings" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pricing_plan" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pricing_plan" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratory_setting" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratory_setting" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_line_item" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_line_item" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "facility_sms_setting" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility_sms_setting" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(`ALTER TABLE "addons" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "addons" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "facility" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "facility" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "hospital_clinic" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital_clinic" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "department" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "department" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(`ALTER TABLE "user_role" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "user_role" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "user_access_token" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_access_token" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratory" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratory" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_mapping" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_mapping" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "test_normal_range" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_normal_range" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_category" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_category" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(`ALTER TABLE "uom" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "uom" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "specimen" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "specimen" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "patient_test" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test_parameter_result" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test_parameter_result" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_parameter" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_parameter" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_group" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_group" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_print_settings" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_print_settings" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(`ALTER TABLE "donor" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "donor" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "configuration" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuration" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuration_option" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuration_option" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(`ALTER TABLE "reference" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "reference" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "patient_account" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_account" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app_feature" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app_feature" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_print_settings" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_print_settings" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "pricing_plan" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "pricing_plan" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratory_setting" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratory_setting" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_line_item" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_line_item" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility_sms_setting" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility_sms_setting" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility_department" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "addons" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "addons" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital_clinic" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital_clinic" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_facility" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "department" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "department" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_access_token" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_access_token" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratory" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "laboratory" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_mapping" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_mapping" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_normal_range" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_normal_range" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_category" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_category" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "uom" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "uom" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "specimen" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "specimen" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test_parameter_result" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_test_parameter_result" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_parameter" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_parameter" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_group" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_group" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list_item" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_test_rate_list" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_print_settings" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_print_settings" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "donor" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "donor" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuration" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuration" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuration_option" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuration_option" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "reference" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "reference" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_account" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_account" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "app_feature" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "app_feature" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }
}
