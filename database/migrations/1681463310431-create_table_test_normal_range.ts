import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableTestNormalRange1681463310431 implements MigrationInterface {
    name = 'CreateTableTestNormalRange1681463310431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "test_normal_range" ("_id" SERIAL NOT NULL, "pl_tnr_id" integer, "normal_range_for" character varying NOT NULL, "pl_group_id" integer, "condition" character varying, "min_op" character varying, "min_value" integer, "max_op" character varying, "max_value" integer, "sequence" integer, "parent_record_id" integer, "archived" boolean NOT NULL DEFAULT false, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "test_id" integer, CONSTRAINT "PK_92a43a355258e00b738a82f7c08" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "test_normal_range" ADD CONSTRAINT "FK_9752fb58e840b01b9d20ff0b99d" FOREIGN KEY ("test_id") REFERENCES "test"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test_normal_range" DROP CONSTRAINT "FK_9752fb58e840b01b9d20ff0b99d"`);
        await queryRunner.query(`DROP TABLE "test_normal_range"`);
    }

}
