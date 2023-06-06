import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transformSortField } from 'src/common/utils/transform-sorting';
import { Facility } from 'src/entities/Facility/facility.entity';
import { Repository } from 'typeorm';
import { Patient } from '../patient.entity';
import { PatientTest } from '../patient_test.entity';

@Injectable()
export class DeletedTestsService {
  constructor(
    @InjectRepository(PatientTest)
    private patientTestRep: Repository<PatientTest>,
    @InjectRepository(Facility)
    private facilityRep: Repository<Facility>,
    @InjectRepository(Patient)
    private patientRep: Repository<Patient>,
  ) {}

  async getDeleteTests(
    user,
    skip: number,
    take: number,
    text?: string,
    sort?: string,
  ): Promise<any> {
    let lab_number;
    if (text) {
      const facilityModel = await this.facilityRep
        .createQueryBuilder('facility')
        .select(['facility._id,facility.unique_id'])
        .where('facility._id = :id', { id: user.facility_id })
        .getOne();

      lab_number = `${facilityModel.unique_id}-${text}`;
    }

    let aggregateResult = await this.patientRep
      .createQueryBuilder('patient')
      .select(
        'patient.age,patient.age_unit,patient.created_at,patient.gender,patient._id as patient_id,patient.name as patient_name,patient.created_at as registration_date',
      )
      .where('patient.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .skip(skip)
      .take(take)
      .orderBy(transformSortField(sort))
      .getRawMany();
    console.log('aggregateResult', aggregateResult);
    for (let i = 0; i < aggregateResult.length; i++) {
      let patient = aggregateResult[i];
      delete patient._id;
      const patientTest = await this.patientTestRep.findOne({
        where: { patient_id: patient.patient_id },
        relations: ['test_id'],
      });
      console.log('patientTest', patientTest);
      const testName = patientTest?.test_id?.name;
      const test_title_for_print = patientTest?.test_id?.title_for_print;
      Object.assign(patient, {
        deleted_by_full_name: user.full_name,
        deleted_by_username: user.user_name,
        status: 15,
        _id: {
          $oid: patient.patient_id,
        },
        title_for_print: test_title_for_print,
        test_name: testName,
        lab_number: '497',
      });
    }
    const data = [
      {
        metadata: [
          {
            total: aggregateResult.length,
            page: 1,
          },
        ],
        data: aggregateResult,
      },
    ];
    return data;
  }
}
