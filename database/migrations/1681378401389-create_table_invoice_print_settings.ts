import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableInvoicePrintSettings1681378401389 implements MigrationInterface {
    name = 'CreateTableInvoicePrintSettings1681378401389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lab_test_rate_list" ("_id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "status" integer NOT NULL, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "facility_id" integer, "laboratory_id" integer, CONSTRAINT "REL_7aaa79d2daa50a2d63aedbee25" UNIQUE ("facility_id"), CONSTRAINT "REL_88dda7c0533c8c5fa5d6cba276" UNIQUE ("laboratory_id"), CONSTRAINT "PK_3fee55e5909156d571abd6f1a6e" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "lab_test_rate_list" ADD CONSTRAINT "FK_7aaa79d2daa50a2d63aedbee25b" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lab_test_rate_list" ADD CONSTRAINT "FK_88dda7c0533c8c5fa5d6cba2768" FOREIGN KEY ("laboratory_id") REFERENCES "laboratory"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lab_test_rate_list" DROP CONSTRAINT "FK_88dda7c0533c8c5fa5d6cba2768"`);
        await queryRunner.query(`ALTER TABLE "lab_test_rate_list" DROP CONSTRAINT "FK_7aaa79d2daa50a2d63aedbee25b"`);
        await queryRunner.query(`DROP TABLE "lab_test_rate_list"`);
    }

}
