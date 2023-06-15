import { Test } from 'src/entities/test/test.entity';
import { specimen } from 'src/entities/specimen/specimen.entity';
import { TestCategory } from 'src/entities/test/test_category.entity';
import { UOM } from 'src/entities/uom/uom.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class DumpDataMannually1686803422814 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Run PostgreSQL queries to insert data

    await queryRunner.query(`
          INSERT INTO specimen (name, description)
          VALUES ('Blood', '')
          RETURNING *;
        `);

    const Specimen = await queryRunner.query(`
          SELECT * FROM specimen
          WHERE name = 'Blood';
        `);

    await queryRunner.query(`
          INSERT INTO test_category (is_template, name, report_template, title_for_print, type)
          VALUES (true, 'Biochemistry', 1, 'Biochemistry', ''),
                 (true, 'Blood Test', 1, 'Blood Test', ''),
                 (true, 'Chemical Pathology', 1, 'Chemical Pathology', ''),
                 (true, 'Microbiology', 1, 'Microbiology', ''),
                 (true, 'MolecularDiagnostic', 1, 'MolecularDiagnostic', '')
          RETURNING *;
        `);

    const testCategory = await queryRunner.query(`
          SELECT * FROM test_category;
        `);

    const uoms = await queryRunner.query(`
          SELECT * FROM uom;
        `);

    console.log('testCategory', testCategory);
    console.log('uoms', uoms);
    console.log('Specimen', Specimen);

    await queryRunner.query(`
        INSERT INTO test (
          is_template, test_category_id, name, title_for_print, single_or_group,
          default_notes, description, specimen_id,
          sample_quantity, duration, uom_id, res_input_type,
          res_input_options, decimal_length
        )
        VALUES (
          true, ${
            testCategory[0] ? `'${testCategory[0]._id}'` : 'NULL'
          }, 'Albumin', 'Albumin', 'single', '', '',
          ${Specimen[0] ? `'${Specimen[0]._id}'` : 'NULL'},
          '{"sample_quantity": "", "unit": "cc"}', '{"duration": "", "unit": "m"}',
          ${uoms[0] ? `'${uoms[0]._id}'` : 'NULL'}, 'text_field', '[]', 0
        ),
        (
          true, ${
            testCategory[1] ? `'${testCategory[1]._id}'` : 'NULL'
          }, 'Blood Compatibility', 'Blood Compatibility', 'single', '', '',
          ${Specimen[0] ? `'${Specimen[0]._id}'` : 'NULL'},
          '{"sample_quantity": "", "unit": "cc"}', '{"duration": "", "unit": "m"}',
          ${uoms[0] ? `'${uoms[0]._id}'` : 'NULL'}, 'text_field', '[]', 0
        ),
        (
          true, ${
            testCategory[2] ? `'${testCategory[2]._id}'` : 'NULL'
          }, 'Blood Urea', 'Blood Urea', 'single', '', '',
          ${Specimen[0] ? `'${Specimen[0]._id}'` : 'NULL'},
          '{"sample_quantity": "", "unit": "cc"}', '{"duration": "", "unit": "m"}',
          ${uoms[0] ? `'${uoms[0]._id}'` : 'NULL'}, 'text_field', '[]', 0
        ),
        (
          true, ${
            testCategory[3] ? `'${testCategory[3]._id}'` : 'NULL'
          }, 'Blood Group', 'Blood Group', 'single', '', '',
          ${Specimen[0] ? `'${Specimen[0]._id}'` : 'NULL'},
          '{"sample_quantity": "", "unit": "cc"}', '{"duration": "", "unit": "m"}',
          ${uoms[0] ? `'${uoms[0]._id}'` : 'NULL'}, 'text_field', '[]', 0
        ),
        (
          true, ${
            testCategory[4] ? `'${testCategory[4]._id}'` : 'NULL'
          }, 'E.S.R', 'E.S.R', 'single', '', '',
          ${Specimen[0] ? `'${Specimen[0]._id}'` : 'NULL'},
          '{"sample_quantity": "", "unit": "cc"}', '{"duration": "", "unit": "m"}',
          ${uoms[0] ? `'${uoms[0]._id}'` : 'NULL'}, 'text_field', '[]', 0
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE test_category CASCADE;`);

    await queryRunner.query(`TRUNCATE TABLE test CASCADE;`);

    await queryRunner.query(`TRUNCATE TABLE specimen CASCADE;`);
  }
}
