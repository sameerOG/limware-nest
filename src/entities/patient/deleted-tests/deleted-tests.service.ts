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
        'patient._id,patient.age,patient.age_unit,patient.created_at,patient.gender,patient._id as patient_id,patient.name as patient_name,patient.created_at as registration_date',
      )
      .withDeleted()
      .where('patient.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .skip(skip)
      .take(take)
      .orderBy(transformSortField('deleted_at'))
      .getRawMany();
    let resultData = [];
    for (let i = 0; i < aggregateResult.length; i++) {
      let patient = aggregateResult[i];
      const patientTests = await this.patientTestRep
        .createQueryBuilder('patient_test')
        .select('patient_test.*,test.name as test_name,test.title_for_print')
        .withDeleted()
        .leftJoin('patient_test.test_id', 'test')
        .where('patient_test.patient_id = :patient_id', {
          patient_id: patient?._id,
        })
        .getRawMany();

      for (let j = 0; j < patientTests.length; j++) {
        let patientData = { ...patient };
        let patientTest = patientTests[j];
        const deleteDate = new Date(patientTest.deleted_at);
        Object.assign(patientData, {
          deleted_by_full_name: user.full_name,
          deleted_by_username: user.user_name,
          delete_reason: patientTest?.delete_reason,
          test_deleted_at:
            deleteDate.getFullYear() +
            '-' +
            (deleteDate.getMonth() + 1) +
            '-' +
            deleteDate.getDate(),
          status: 15,
          _id: {
            $oid: patient.patient_id,
          },
          title_for_print: patientTest?.title_for_print,
          test_name: patientTest?.test_name,
          lab_number: '',
        });
        resultData.push(patientData);
      }
    }
    const data = [
      {
        metadata: [
          {
            total: aggregateResult.length,
            page: 1,
          },
        ],
        data: resultData,
      },
    ];
    return data;
  }
}
