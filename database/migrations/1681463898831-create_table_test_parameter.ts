import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableTestParameter1681463898831 implements MigrationInterface {
    name = 'CreateTableTestParameter1681463898831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "test_parameter" ("_id" SERIAL NOT NULL, "facility_id" integer, "pl_tp_id" integer NOT NULL, "sequence" integer, "archived" boolean NOT NULL DEFAULT false, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "parent_test_id" integer, "child_test_id" integer, "laboratory_id" integer, "test_group_id" integer, CONSTRAINT "PK_45e7ff8d2981136ef4827eb38ef" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "test_parameter" ADD CONSTRAINT "FK_f213432f4c56645c2b86f14e89c" FOREIGN KEY ("parent_test_id") REFERENCES "test"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test_parameter" ADD CONSTRAINT "FK_a237cf10fe63784904729dfc1b6" FOREIGN KEY ("child_test_id") REFERENCES "test"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test_parameter" ADD CONSTRAINT "FK_88a5aa0751628646e0989b4e1ac" FOREIGN KEY ("laboratory_id") REFERENCES "laboratory"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test_parameter" ADD CONSTRAINT "FK_eca03a1193e5a9d39f6312cb628" FOREIGN KEY ("test_group_id") REFERENCES "test_group"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test_parameter" DROP CONSTRAINT "FK_eca03a1193e5a9d39f6312cb628"`);
        await queryRunner.query(`ALTER TABLE "test_parameter" DROP CONSTRAINT "FK_88a5aa0751628646e0989b4e1ac"`);
        await queryRunner.query(`ALTER TABLE "test_parameter" DROP CONSTRAINT "FK_a237cf10fe63784904729dfc1b6"`);
        await queryRunner.query(`ALTER TABLE "test_parameter" DROP CONSTRAINT "FK_f213432f4c56645c2b86f14e89c"`);
        await queryRunner.query(`DROP TABLE "test_parameter"`);
    }

}
