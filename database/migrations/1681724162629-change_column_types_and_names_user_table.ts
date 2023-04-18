import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeColumnTypesAndNamesUserTable1681724162629 implements MigrationInterface {
    name = 'ChangeColumnTypesAndNamesUserTable1681724162629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_01eea41349b6c9275aec646eee0"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "date_created"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "date_modified"`);
        
        await queryRunner.query(`ALTER TABLE "user" ADD "mobile_number" character varying NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_9d6d873483c7fae39567c209192" UNIQUE ("mobile_number")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        
        await queryRunner.query(`ALTER TABLE "user_access_token" DROP CONSTRAINT "FK_2b0deb13c24dffe95d71506ace4"`);
        await queryRunner.query(`ALTER TABLE "user_access_token" DROP CONSTRAINT "REL_2b0deb13c24dffe95d71506ace"`);
        await queryRunner.query(`ALTER TABLE "user_access_token" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "user_access_token" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "user_access_token" ADD CONSTRAINT "UQ_2b0deb13c24dffe95d71506ace4" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "user_department" DROP CONSTRAINT "FK_92bb51ffd463f2dfba95539e10d"`);
        await queryRunner.query(`ALTER TABLE "user_department" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "user_department" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_d0e5815877f7395a198a4cb0a46"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "FK_898987193e388cdc54edf00e5a7"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_f61258e58ed35475ce1dba03797"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_457bfa3e35350a716846b03102d"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "_id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "_id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_457bfa3e35350a716846b03102d" PRIMARY KEY ("_id")`);
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "REL_898987193e388cdc54edf00e5a"`);
        await queryRunner.query(`ALTER TABLE "department" DROP COLUMN "hod_id"`);
        await queryRunner.query(`ALTER TABLE "department" ADD "hod_id" uuid`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "UQ_898987193e388cdc54edf00e5a7" UNIQUE ("hod_id")`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "REL_f61258e58ed35475ce1dba0379"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "UQ_f61258e58ed35475ce1dba03797" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "user_access_token" ADD CONSTRAINT "FK_2b0deb13c24dffe95d71506ace4" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_department" ADD CONSTRAINT "FK_92bb51ffd463f2dfba95539e10d" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_d0e5815877f7395a198a4cb0a46" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "FK_898987193e388cdc54edf00e5a7" FOREIGN KEY ("hod_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_f61258e58ed35475ce1dba03797" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_f61258e58ed35475ce1dba03797"`);
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "FK_898987193e388cdc54edf00e5a7"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_d0e5815877f7395a198a4cb0a46"`);
        await queryRunner.query(`ALTER TABLE "user_department" DROP CONSTRAINT "FK_92bb51ffd463f2dfba95539e10d"`);
        await queryRunner.query(`ALTER TABLE "user_access_token" DROP CONSTRAINT "FK_2b0deb13c24dffe95d71506ace4"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "UQ_f61258e58ed35475ce1dba03797"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "REL_f61258e58ed35475ce1dba0379" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "UQ_898987193e388cdc54edf00e5a7"`);
        await queryRunner.query(`ALTER TABLE "department" DROP COLUMN "hod_id"`);
        await queryRunner.query(`ALTER TABLE "department" ADD "hod_id" integer`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "REL_898987193e388cdc54edf00e5a" UNIQUE ("hod_id")`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_457bfa3e35350a716846b03102d"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "_id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "_id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_457bfa3e35350a716846b03102d" PRIMARY KEY ("_id")`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_f61258e58ed35475ce1dba03797" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "FK_898987193e388cdc54edf00e5a7" FOREIGN KEY ("hod_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_d0e5815877f7395a198a4cb0a46" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_department" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "user_department" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_department" ADD CONSTRAINT "FK_92bb51ffd463f2dfba95539e10d" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_access_token" DROP CONSTRAINT "UQ_2b0deb13c24dffe95d71506ace4"`);
        await queryRunner.query(`ALTER TABLE "user_access_token" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "user_access_token" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "user_access_token" ADD CONSTRAINT "REL_2b0deb13c24dffe95d71506ace" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "user_access_token" ADD CONSTRAINT "FK_2b0deb13c24dffe95d71506ace4" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_9d6d873483c7fae39567c209192"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "mobile_number"`);
       
        await queryRunner.query(`ALTER TABLE "user" ADD "date_modified" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "date_created" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phone_number" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_01eea41349b6c9275aec646eee0" UNIQUE ("phone_number")`);
    }

}
