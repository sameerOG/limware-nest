import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeType1681716785096 implements MigrationInterface {
    name = 'ChangeType1681716785096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "system_role"`);
        await queryRunner.query(`ALTER TABLE "role" ADD "system_role" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "system_role"`);
        await queryRunner.query(`ALTER TABLE "role" ADD "system_role" json`);
    }

}
