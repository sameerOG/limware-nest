import { MigrationInterface, QueryRunner } from "typeorm";

export class ResolveRelations1681712343423 implements MigrationInterface {
    name = 'ResolveRelations1681712343423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "laboratory" DROP CONSTRAINT "FK_123c8d313266114973c600bfb95"`);
        await queryRunner.query(`ALTER TABLE "laboratory" DROP CONSTRAINT "FK_7dc4cceb4a3d9dbef31546b1a06"`);
        await queryRunner.query(`ALTER TABLE "laboratory" DROP CONSTRAINT "REL_123c8d313266114973c600bfb9"`);
        await queryRunner.query(`ALTER TABLE "laboratory" DROP CONSTRAINT "REL_7dc4cceb4a3d9dbef31546b1a0"`);
        await queryRunner.query(`ALTER TABLE "facility" DROP CONSTRAINT "FK_61198782511b0323d5cc50974be"`);
        await queryRunner.query(`ALTER TABLE "facility" DROP CONSTRAINT "REL_61198782511b0323d5cc50974b"`);
        await queryRunner.query(`ALTER TABLE "laboratory" ADD CONSTRAINT "FK_123c8d313266114973c600bfb95" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "laboratory" ADD CONSTRAINT "FK_7dc4cceb4a3d9dbef31546b1a06" FOREIGN KEY ("customer_id") REFERENCES "customer"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "facility" ADD CONSTRAINT "FK_61198782511b0323d5cc50974be" FOREIGN KEY ("customer_id") REFERENCES "customer"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facility" DROP CONSTRAINT "FK_61198782511b0323d5cc50974be"`);
        await queryRunner.query(`ALTER TABLE "laboratory" DROP CONSTRAINT "FK_7dc4cceb4a3d9dbef31546b1a06"`);
        await queryRunner.query(`ALTER TABLE "laboratory" DROP CONSTRAINT "FK_123c8d313266114973c600bfb95"`);
        await queryRunner.query(`ALTER TABLE "facility" ADD CONSTRAINT "REL_61198782511b0323d5cc50974b" UNIQUE ("customer_id")`);
        await queryRunner.query(`ALTER TABLE "facility" ADD CONSTRAINT "FK_61198782511b0323d5cc50974be" FOREIGN KEY ("customer_id") REFERENCES "customer"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "laboratory" ADD CONSTRAINT "REL_7dc4cceb4a3d9dbef31546b1a0" UNIQUE ("customer_id")`);
        await queryRunner.query(`ALTER TABLE "laboratory" ADD CONSTRAINT "REL_123c8d313266114973c600bfb9" UNIQUE ("facility_id")`);
        await queryRunner.query(`ALTER TABLE "laboratory" ADD CONSTRAINT "FK_7dc4cceb4a3d9dbef31546b1a06" FOREIGN KEY ("customer_id") REFERENCES "customer"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "laboratory" ADD CONSTRAINT "FK_123c8d313266114973c600bfb95" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
