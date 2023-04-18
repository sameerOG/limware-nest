import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFeatureIdInUser1681364182037 implements MigrationInterface {
    name = 'AddFeatureIdInUser1681364182037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "feature_id" integer DEFAULT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "feature_id"`);
    }

}
