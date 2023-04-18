import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUserDonor1681371173154 implements MigrationInterface {
    name = 'CreateTableUserDonor1681371173154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "donor" ("_id" SERIAL NOT NULL, "name" character varying NOT NULL, "blood_group" character varying, "age" integer NOT NULL, "unique_id" integer NOT NULL, "age_unit" character varying NOT NULL, "gender" character varying NOT NULL, "address" character varying, "city" character varying, "mobile_number" character varying NOT NULL, "registration_date" TIMESTAMP NOT NULL, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "facility_id" integer, "laboratory_id" integer, CONSTRAINT "REL_dd2da1f2775b623e7fdeb394d6" UNIQUE ("facility_id"), CONSTRAINT "REL_bd6cb86652151e79ac45f54e60" UNIQUE ("laboratory_id"), CONSTRAINT "PK_872d3d4bd68a3752e2aee1e8af8" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "donor" ADD CONSTRAINT "FK_dd2da1f2775b623e7fdeb394d63" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "donor" ADD CONSTRAINT "FK_bd6cb86652151e79ac45f54e605" FOREIGN KEY ("laboratory_id") REFERENCES "laboratory"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donor" DROP CONSTRAINT "FK_bd6cb86652151e79ac45f54e605"`);
        await queryRunner.query(`ALTER TABLE "donor" DROP CONSTRAINT "FK_dd2da1f2775b623e7fdeb394d63"`);
        await queryRunner.query(`DROP TABLE "donor"`);
    }

}
