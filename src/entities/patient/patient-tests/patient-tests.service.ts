import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transformSortField } from 'src/common/utils/transform-sorting';
import { Facility } from 'src/entities/Facility/facility.entity';
import { Repository } from 'typeorm';
import { UpdatePatientTestStatusRequestDto } from '../dto/request.dto';
import { Patient } from '../patient.entity';
import { PatientTest } from '../patient_test.entity';

@Injectable()
export class PatientTestsService {
  constructor(
    @InjectRepository(PatientTest)
    private patientTestRep: Repository<PatientTest>,
    @InjectRepository(Facility)
    private facilityRep: Repository<Facility>,
    @InjectRepository(Patient)
    private patientRep: Repository<Patient>,
  ) { }

  async updateStatus(
    id: string,
    body: UpdatePatientTestStatusRequestDto,
  ): Promise<PatientTest> {
    await this.patientTestRep
      .createQueryBuilder('patient_test')
      .update(PatientTest)
      .set({ sample_status: body.sample_status })
      .where({ test_id: id })
      .execute();

    const data = await this.patientTestRep
      .createQueryBuilder('patient_test')
      .select('patient_test.*')
      .where('patient_test.test_id = :test_id', { test_id: id })
      .getRawOne();
    console.log('data', data);
    return data;
  }

  async getPatientTests(
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
      .andWhere('patient.deleted_at IS NULL')
      .skip(skip)
      .take(take)
      .orderBy(transformSortField(sort))
      .getRawMany();
    for (let i = 0; i < aggregateResult.length; i++) {
      let patient = aggregateResult[i];
      delete patient._id;
      const patientTest = await this.patientTestRep.findOne({
        where: { patient_id: patient.patient_id },
        relations: ['test_id'],
      });
      const testName = patientTest?.test_id?.name;
      const test_title_for_print = patientTest?.test_id?.title_for_print;
      Object.assign(patient, {
        status: patientTest?.status,
        _id: {
          $oid: patient.patient_id,
        },
        title_for_print: test_title_for_print,
        test_name: testName,
        lab_number: '',
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

  async getPatientByIdAndUpdate(patient_test_id, donor_id): Promise<PatientTest | any> {
    const patientTest = await this.patientTestRep.findOne({ where: { test_id: patient_test_id } })
    if (patientTest) {
      patientTest.donor_id = donor_id;
      return await this.patientTestRep.save(patientTest)
    } else {
      const message = 'Record not found for this patient'
      return message;
    }

  }
}
