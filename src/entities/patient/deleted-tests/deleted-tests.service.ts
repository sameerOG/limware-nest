import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/baseService';
import { transformSortField } from 'src/common/utils/transform-sorting';
import { Facility } from 'src/entities/Facility/facility.entity';
import { Repository } from 'typeorm';
import { Patient } from '../patient.entity';
import { PatientTest } from '../patient_test.entity';

@Injectable()
export class DeletedTestsService {
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

  async getDeleteTests(
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
    let resultData = [];
    for (let i = 0; i < aggregateResult.length; i++) {
      let patient = aggregateResult[i];
      const patientTests = await this.patientTestRepository
        .createQueryBuilder('patient_test')
        .select('patient_test.*,test.name as test_name,test.title_for_print')
        .withDeleted()
        .leftJoin('patient_test.test_id', 'test')
        .where('patient_test.patient_id = :patient_id', {
          patient_id: patient?._id,
        })
        .andWhere('patient_test.deleted_at IS NOT NULL')
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
            $oid: patient._id,
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
