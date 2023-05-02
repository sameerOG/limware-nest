import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfileImageInUsers1683008239131 implements MigrationInterface {
  name = 'AddProfileImageInUsers1683008239131';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "profile_image_name" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "profile_image_name"`,
    );
  }
}
