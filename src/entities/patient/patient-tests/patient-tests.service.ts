import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/baseService';
import { transformSortField } from 'src/common/utils/transform-sorting';
import { Facility } from 'src/entities/Facility/facility.entity';
import { Repository } from 'typeorm';
import { UpdatePatientTestStatusRequestDto } from '../dto/request.dto';
import { Patient } from '../patient.entity';
import { PatientTest } from '../patient_test.entity';

@Injectable()
export class PatientTestsService {
  private patientTestRep: BaseService<PatientTest>;
  private facilityRep: BaseService<Facility>;
  private patientRep: BaseService<Patient>;

  constructor(
    @InjectRepository(PatientTest)
    private patientTestRepository: Repository<PatientTest>,
    @InjectRepository(Facility)
    private facilityRepository: Repository<Facility>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {
    this.patientTestRep = new BaseService<PatientTest>(
      this.patientTestRepository,
    );
    this.facilityRep = new BaseService<Facility>(this.facilityRepository);
    this.patientRep = new BaseService<Patient>(this.patientRepository);
  }

  async updateStatus(
    id: string,
    body: UpdatePatientTestStatusRequestDto,
  ): Promise<PatientTest> {
    await this.patientTestRep.update(
      { test_id: { _id: id } },
      { sample_status: body.sample_status },
    );

    const data = await this.patientTestRep.findOne({
      where: {
        test_id: {
          _id: id,
        },
      },
    });
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
      const facilityModel = await this.facilityRep.findOne({
        select: ['_id', 'unique_id'],
        where: {
          _id: user.facility_id,
        },
      });
      lab_number = `${facilityModel.unique_id}-${text}`;
    }
    let aggregateResult = await this.patientRep.findAll({
      select: [
        'patient.age',
        'patient.age_unit',
        'patient.created_at',
        'patient.gender',
        'patient._id',
        'patient.name',
        'patient.created_at',
      ],
      where: {
        facility_id: {
          _id: user.facility_id,
        },
        deleted_at: null,
      },
      skip,
      take,
      order: transformSortField(sort),
    });
    for (let i = 0; i < aggregateResult.length; i++) {
      let patient = aggregateResult[i];
      Object.assign(patient, {
        patient_id: patient._id,
        patient_name: patient.name,
        registeration_date: patient.created_at,
      });
      delete patient._id;
      const patientTest = await this.patientTestRep.findOne({
        where: { patient_id: patient._id },
        relations: ['test_id'],
      });
      const testName = patientTest?.test_id?.name;
      const test_title_for_print = patientTest?.test_id?.title_for_print;
      Object.assign(patient, {
        status: patientTest?.status,
        _id: {
          $oid: patient._id,
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

  async getPatientByIdAndUpdate(
    patient_test_id,
    donor_id,
  ): Promise<PatientTest | any> {
    const patientTest = await this.patientTestRep.findOne({
      where: { test_id: patient_test_id },
    });
    if (patientTest) {
      patientTest.donor_id = donor_id;
      return await this.patientTestRep.save(patientTest);
    } else {
      const message = 'Record not found for this patient';
      return message;
    }
  }
}
