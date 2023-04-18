import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUserAccessToken1681366581539 implements MigrationInterface {
    name = 'CreateTableUserAccessToken1681366581539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_access_token" ("_id" SERIAL NOT NULL, "access_token" character varying, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "facility_id" integer, "user_id" integer, CONSTRAINT "REL_38b2a7e43836eedd01b0d54b6d" UNIQUE ("facility_id"), CONSTRAINT "REL_2b0deb13c24dffe95d71506ace" UNIQUE ("user_id"), CONSTRAINT "PK_05d8155b549ea9622a41101dd95" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "user_access_token" ADD CONSTRAINT "FK_38b2a7e43836eedd01b0d54b6df" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_access_token" ADD CONSTRAINT "FK_2b0deb13c24dffe95d71506ace4" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_access_token" DROP CONSTRAINT "FK_2b0deb13c24dffe95d71506ace4"`);
        await queryRunner.query(`ALTER TABLE "user_access_token" DROP CONSTRAINT "FK_38b2a7e43836eedd01b0d54b6df"`);
        await queryRunner.query(`DROP TABLE "user_access_token"`);
    }

}
