import { MigrationInterface, QueryRunner } from 'typeorm';

export class SoftdeleteOutgoingMailServers1681888862441
  implements MigrationInterface
{
  name = 'SoftdeleteOutgoingMailServers1681888862441';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "outgoing_mail_server" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "outgoing_mail_server" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "outgoing_mail_server" ADD "deleted_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "outgoing_mail_server" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "outgoing_mail_server" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "outgoing_mail_server" DROP COLUMN "created_at"`,
    );
  }
}
