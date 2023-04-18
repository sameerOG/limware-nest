import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1681294315858 implements MigrationInterface {
    name = 'CreateUserTable1681294315858'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("_id" SERIAL NOT NULL, "isSuperUser" integer NOT NULL, "portal" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying, "phone_number" character varying NOT NULL, "password_hash" character varying NOT NULL, "password_reset_token" character varying, "password" character varying NOT NULL, "full_name" character varying NOT NULL, "address" character varying, "city" character varying, "auth_key" character varying, "status" integer NOT NULL DEFAULT '0', "otp" integer, "password_reset_pin" integer, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_01eea41349b6c9275aec646eee0" UNIQUE ("phone_number"), CONSTRAINT "UQ_a53e5d9ab118cc964318b3f7297" UNIQUE ("password_reset_token"), CONSTRAINT "PK_457bfa3e35350a716846b03102d" PRIMARY KEY ("_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
