import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableLaboratorySettings1685519770553 implements MigrationInterface {
    name = 'AlterTableLaboratorySettings1685519770553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "laboratory_setting" DROP COLUMN "facility_id"`);
        await queryRunner.query(`ALTER TABLE "laboratory_setting" ADD "facility_id" character varying`);
        await queryRunner.query(`ALTER TABLE "laboratory_setting" DROP COLUMN "laboratory_id"`);
        await queryRunner.query(`ALTER TABLE "laboratory_setting" ADD "laboratory_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "laboratory_setting" DROP COLUMN "laboratory_id"`);
        await queryRunner.query(`ALTER TABLE "laboratory_setting" ADD "laboratory_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "laboratory_setting" DROP COLUMN "facility_id"`);
        await queryRunner.query(`ALTER TABLE "laboratory_setting" ADD "facility_id" integer`);
    }

}
