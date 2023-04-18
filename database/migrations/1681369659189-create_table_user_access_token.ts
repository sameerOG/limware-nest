import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUserAccessToken1681369659189 implements MigrationInterface {
    name = 'CreateTableUserAccessToken1681369659189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "laboratory" ("_id" SERIAL NOT NULL, "name" character varying NOT NULL, "logo_file" character varying, "type" character varying NOT NULL, "mobile_number" character varying NOT NULL, "unique_id" character varying NOT NULL, "contact_numbers" json NOT NULL, "status" integer, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "parent_lab_id" integer, "facility_id" integer, "customer_id" integer, CONSTRAINT "UQ_dc2b8e0bbc0ab0aea33c3e36d0d" UNIQUE ("unique_id"), CONSTRAINT "REL_3af2ca1314d7502affeb9e1981" UNIQUE ("parent_lab_id"), CONSTRAINT "REL_123c8d313266114973c600bfb9" UNIQUE ("facility_id"), CONSTRAINT "REL_7dc4cceb4a3d9dbef31546b1a0" UNIQUE ("customer_id"), CONSTRAINT "PK_52752bddb034a9e250fe03cb256" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "department" ("_id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "pf_department_id" integer, "parent" character varying NOT NULL, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "facility_id" integer, "hod_id" integer, "parent_id" integer, CONSTRAINT "REL_64363fe69958a5be1f06758b54" UNIQUE ("facility_id"), CONSTRAINT "REL_898987193e388cdc54edf00e5a" UNIQUE ("hod_id"), CONSTRAINT "REL_110d56d702b0880fe9b005878e" UNIQUE ("parent_id"), CONSTRAINT "PK_4cd376d1af65c54149891ee2c6b" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "laboratory" ADD CONSTRAINT "FK_3af2ca1314d7502affeb9e1981a" FOREIGN KEY ("parent_lab_id") REFERENCES "laboratory"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "laboratory" ADD CONSTRAINT "FK_123c8d313266114973c600bfb95" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "laboratory" ADD CONSTRAINT "FK_7dc4cceb4a3d9dbef31546b1a06" FOREIGN KEY ("customer_id") REFERENCES "customer"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "FK_64363fe69958a5be1f06758b549" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "FK_898987193e388cdc54edf00e5a7" FOREIGN KEY ("hod_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "FK_110d56d702b0880fe9b005878e9" FOREIGN KEY ("parent_id") REFERENCES "laboratory"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "FK_110d56d702b0880fe9b005878e9"`);
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "FK_898987193e388cdc54edf00e5a7"`);
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "FK_64363fe69958a5be1f06758b549"`);
        await queryRunner.query(`ALTER TABLE "laboratory" DROP CONSTRAINT "FK_7dc4cceb4a3d9dbef31546b1a06"`);
        await queryRunner.query(`ALTER TABLE "laboratory" DROP CONSTRAINT "FK_123c8d313266114973c600bfb95"`);
        await queryRunner.query(`ALTER TABLE "laboratory" DROP CONSTRAINT "FK_3af2ca1314d7502affeb9e1981a"`);
        await queryRunner.query(`DROP TABLE "department"`);
        await queryRunner.query(`DROP TABLE "laboratory"`);
    }

}
