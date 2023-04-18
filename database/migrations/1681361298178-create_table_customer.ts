import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableCustomer1681361298178 implements MigrationInterface {
    name = 'CreateTableCustomer1681361298178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customer" ("_id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying, "mobile_number" character varying NOT NULL, "contact_numbers" json DEFAULT NULL, "address" character varying, "city" character varying NOT NULL, "status" integer NOT NULL DEFAULT '0', "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f4723fb1191a09a65c96c1e1a3b" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "contact_numbers" json DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "customer_id" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_d72eb2a5bbff4f2533a5d4caff9" UNIQUE ("customer_id")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_d72eb2a5bbff4f2533a5d4caff9" FOREIGN KEY ("customer_id") REFERENCES "customer"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_d72eb2a5bbff4f2533a5d4caff9"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_d72eb2a5bbff4f2533a5d4caff9"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "customer_id"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "contact_numbers"`);
        await queryRunner.query(`DROP TABLE "customer"`);
    }

}
