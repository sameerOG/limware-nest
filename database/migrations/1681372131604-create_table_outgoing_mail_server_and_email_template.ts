import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableOutgoingMailServerAndEmailTemplate1681372131604 implements MigrationInterface {
    name = 'CreateTableOutgoingMailServerAndEmailTemplate1681372131604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "outgoing_mail_server" ("_id" SERIAL NOT NULL, "title" character varying NOT NULL, "is_default" boolean NOT NULL DEFAULT false, "host" character varying NOT NULL, "port" integer NOT NULL, "encryption" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_6ec33900342be45ad2d6679c5b9" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "email_template" ("_id" SERIAL NOT NULL, "title" character varying NOT NULL, "action" character varying NOT NULL, "subject" character varying NOT NULL, "body" json NOT NULL, "password" character varying NOT NULL, "outgoing_mail_server_id" integer, CONSTRAINT "REL_2bf60bef899c19213cc833d8fc" UNIQUE ("outgoing_mail_server_id"), CONSTRAINT "PK_e68a172d9844d4bf61e27f5878d" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "email_template" ADD CONSTRAINT "FK_2bf60bef899c19213cc833d8fce" FOREIGN KEY ("outgoing_mail_server_id") REFERENCES "outgoing_mail_server"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_template" DROP CONSTRAINT "FK_2bf60bef899c19213cc833d8fce"`);
        await queryRunner.query(`DROP TABLE "email_template"`);
        await queryRunner.query(`DROP TABLE "outgoing_mail_server"`);
    }

}
