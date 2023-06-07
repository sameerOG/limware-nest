import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUniqueIdTypeInDonor1686136217458 implements MigrationInterface {
    name = 'ChangeUniqueIdTypeInDonor1686136217458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donor" DROP COLUMN "unique_id"`);
        await queryRunner.query(`ALTER TABLE "donor" ADD "unique_id" character varying`);
        await queryRunner.query(`ALTER TABLE "donor" ADD CONSTRAINT "UQ_778e1d42dbcea0e6e5425714bee" UNIQUE ("unique_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donor" DROP CONSTRAINT "UQ_778e1d42dbcea0e6e5425714bee"`);
        await queryRunner.query(`ALTER TABLE "donor" DROP COLUMN "unique_id"`);
        await queryRunner.query(`ALTER TABLE "donor" ADD "unique_id" SERIAL NOT NULL`);
    }

}
