import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterDonorTableFields1686115068389 implements MigrationInterface {
    name = 'AlterDonorTableFields1686115068389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donor" ALTER COLUMN "registration_date" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donor" ALTER COLUMN "registration_date" SET NOT NULL`);
    }

}
