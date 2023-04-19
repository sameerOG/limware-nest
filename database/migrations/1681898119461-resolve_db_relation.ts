import { MigrationInterface, QueryRunner } from 'typeorm';

export class ResolveDbRelation1681898119461 implements MigrationInterface {
  name = 'ResolveDbRelation1681898119461';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email_template" DROP CONSTRAINT "FK_2bf60bef899c19213cc833d8fce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_template" DROP CONSTRAINT "UQ_2bf60bef899c19213cc833d8fce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_template" ADD CONSTRAINT "FK_2bf60bef899c19213cc833d8fce" FOREIGN KEY ("outgoing_mail_server_id") REFERENCES "outgoing_mail_server"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email_template" DROP CONSTRAINT "FK_2bf60bef899c19213cc833d8fce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_template" ADD CONSTRAINT "UQ_2bf60bef899c19213cc833d8fce" UNIQUE ("outgoing_mail_server_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_template" ADD CONSTRAINT "FK_2bf60bef899c19213cc833d8fce" FOREIGN KEY ("outgoing_mail_server_id") REFERENCES "outgoing_mail_server"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
