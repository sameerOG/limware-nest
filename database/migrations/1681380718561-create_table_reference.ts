import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableReference1681380718561 implements MigrationInterface {
    name = 'CreateTableReference1681380718561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_department" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "department_id" integer NOT NULL, CONSTRAINT "PK_afd2c87bee70dd5557f48911e66" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_department" ADD CONSTRAINT "FK_92bb51ffd463f2dfba95539e10d" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_department" ADD CONSTRAINT "FK_7044b4fcd0d40c6f11ed27a0b70" FOREIGN KEY ("department_id") REFERENCES "department"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_department" DROP CONSTRAINT "FK_7044b4fcd0d40c6f11ed27a0b70"`);
        await queryRunner.query(`ALTER TABLE "user_department" DROP CONSTRAINT "FK_92bb51ffd463f2dfba95539e10d"`);
        await queryRunner.query(`DROP TABLE "user_department"`);
    }

}
