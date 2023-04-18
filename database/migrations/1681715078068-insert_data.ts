import { MigrationInterface, QueryRunner } from "typeorm"

export class InsertData1681715078068 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {


        // User Insertion
        await queryRunner.query(`
            INSERT INTO "user" ("isSuperUser", "portal", "username", "email", "phone_number", "password_hash","password", "auth_key", "full_name", "contact_numbers", "address", "city", "status")
            VALUES (1, 'administration', 'admin', 'mohsin@limware.com', '3326526919', '$2y$13$73xx5IPg4hrh.6B.kV7RVenwzkwnXv13S3i2JeT2cKJ7le8t0xGDi','$2y$13$73xx5IPg4hrh.6B.kV7RVenwzkwnXv13S3i2JeT2cKJ7le8t0xGDi', 'b8U_akQeTOXGRotijzKRQqpzT_OYe5sp', 'Mohsin Shoaib', '[{"type":"mobile","number":"3326526919"},{"type":"mobile","number":"3157442719"},{"type":"ptcl","number":"423545123"}]', 'Johar Town', 'Lahore', 1);
        `);

        //Role Insertion
        await queryRunner.query(`
            INSERT INTO "role" ("name", "status", "portal")
            VALUES ('Lab Admin', 1, 'limware');
        `);

        //UOM Insertion
        const uom = [
            { name: '%', description: 'Percentage' },
            { name: 'g', description: 'Grams' },
            { name: 'g/dL', description: 'Grams per deciliter (g/dL)' },
            { name: 'g/L', description: 'Grams per liter (g/L)' },
            { name: 'IU/L', description: 'International units per liter (IU/L)' },
          ];

          //Specimen Insertion
          const specimen = [
            { name: 'Blood' },
            { name: 'Sputum' },
            { name: 'Saliva' },
            { name: 'Stool' },
            { name: 'Urine' },
            { name: 'Semen' },
            { name: 'Serum' },
          ];
      
          for (const data of uom) {
            await queryRunner.query(`
                INSERT INTO "uom" ("name", "description")
                VALUES ('${data.name}', '${data.description}');
            `);
          }

          for (const data of specimen) {
            await queryRunner.query(`
              INSERT INTO uom ("name")
              VALUES ('${data.name}')
            `);
          }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM user WHERE email = 'mohsin@limware.com'`);
    }

}

