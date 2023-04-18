import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableEmployee1681363924754 implements MigrationInterface {
    name = 'CreateTableEmployee1681363924754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "employee" ("_id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying DEFAULT NULL, "cnic" character varying DEFAULT NULL, "gender" character varying NOT NULL, "mobile_number" character varying NOT NULL, "contact_numbers" json DEFAULT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "status" integer NOT NULL, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "date_modified" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer DEFAULT NULL, "facility_id" integer NOT NULL, "customer_id" integer NOT NULL, CONSTRAINT "REL_f61258e58ed35475ce1dba0379" UNIQUE ("user_id"), CONSTRAINT "REL_f153a813d149a32e6187ae2659" UNIQUE ("facility_id"), CONSTRAINT "REL_06d129015f87cc68656ee211d4" UNIQUE ("customer_id"), CONSTRAINT "PK_f2c2c2cbb5aa89df31fbef706af" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_f61258e58ed35475ce1dba03797" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_f153a813d149a32e6187ae26594" FOREIGN KEY ("facility_id") REFERENCES "facility"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_06d129015f87cc68656ee211d45" FOREIGN KEY ("customer_id") REFERENCES "customer"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_06d129015f87cc68656ee211d45"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_f153a813d149a32e6187ae26594"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_f61258e58ed35475ce1dba03797"`);
        await queryRunner.query(`DROP TABLE "employee"`);
    }

}
