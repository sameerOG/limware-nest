import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveFacilityRelationFromUserAccessToken1682417847272
  implements MigrationInterface
{
  name = 'RemoveFacilityRelationFromUserAccessToken1682417847272';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_access_token" DROP CONSTRAINT "FK_38b2a7e43836eedd01b0d54b6df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_access_token" DROP CONSTRAINT "UQ_38b2a7e43836eedd01b0d54b6df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_access_token" DROP COLUMN "facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_access_token" ADD "facility_id" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_access_token" DROP COLUMN "facility_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_access_token" ADD "facility_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_access_token" ADD CONSTRAINT "UQ_38b2a7e43836eedd01b0d54b6df" UNIQUE ("facility_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_access_token" ADD CONSTRAINT "FK_38b2a7e43836eedd01b0d54b6df" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
