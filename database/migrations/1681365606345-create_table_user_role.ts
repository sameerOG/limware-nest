import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUserRole1681365606345 implements MigrationInterface {
    name = 'CreateTableUserRole1681365606345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_role" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_fb2e442d14add3cefbdf33c4561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_d0e5815877f7395a198a4cb0a46" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_32a6fc2fcb019d8e3a8ace0f55f" FOREIGN KEY ("role_id") REFERENCES "role"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_32a6fc2fcb019d8e3a8ace0f55f"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_d0e5815877f7395a198a4cb0a46"`);
        await queryRunner.query(`DROP TABLE "user_role"`);
    }

}
