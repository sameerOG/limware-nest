import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableReference1681380103700 implements MigrationInterface {
    name = 'CreateTableReference1681380103700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reference" ("_id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying, "mobile_number" character varying, "facility_id" integer NOT NULL, "address" character varying, "city" character varying, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9621433a6a697d11bef015d4804" PRIMARY KEY ("_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "reference"`);
    }

}
