import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableLabTestRate1681379480587 implements MigrationInterface {
    name = 'CreateTableLabTestRate1681379480587'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lab_test_rate_list_item" ("_id" SERIAL NOT NULL, "name" character varying NOT NULL, "test_id" character varying NOT NULL, "description" character varying, "price" double precision NOT NULL, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "facility_id" integer, "laboratory_id" integer, CONSTRAINT "REL_21ef59121bcd745e6626eb5a48" UNIQUE ("facility_id"), CONSTRAINT "REL_14ee55caf371e2f3e9f67ef17a" UNIQUE ("laboratory_id"), CONSTRAINT "PK_4a48ce6158b9e784aaabf4023d8" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "lab_test_rate_list_item" ADD CONSTRAINT "FK_21ef59121bcd745e6626eb5a48a" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lab_test_rate_list_item" ADD CONSTRAINT "FK_14ee55caf371e2f3e9f67ef17a0" FOREIGN KEY ("laboratory_id") REFERENCES "laboratory"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lab_test_rate_list_item" DROP CONSTRAINT "FK_14ee55caf371e2f3e9f67ef17a0"`);
        await queryRunner.query(`ALTER TABLE "lab_test_rate_list_item" DROP CONSTRAINT "FK_21ef59121bcd745e6626eb5a48a"`);
        await queryRunner.query(`DROP TABLE "lab_test_rate_list_item"`);
    }

}
