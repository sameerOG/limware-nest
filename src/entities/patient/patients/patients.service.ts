import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InjectRepository } from '@nestjs/typeorm';
import { isNumber } from 'class-validator';
import { transformSortField } from 'src/common/utils/transform-sorting';
import { Appointment } from 'src/entities/appointment/appointment.entity';
import { Facility } from 'src/entities/Facility/facility.entity';
import { Invoice } from 'src/entities/invoice/invoice.entity';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { In, Repository } from 'typeorm';
import { UpdatePatientRequestDto } from '../dto/request.dto';
import {
  PatientInfoResponseDto,
  PatientListResponseDto,
} from '../dto/response.dto';
import { Patient } from '../patient.entity';
import { PatientAccount } from '../patient_account.entity';
import { PatientTest } from '../patient_test.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientRep: Repository<Patient>,
    @InjectRepository(Laboratory)
    private labRep: Repository<Laboratory>,
    @InjectRepository(Facility)
    private facilityRep: Repository<Facility>,
    @InjectRepository(Invoice)
    private invoiceRep: Repository<Invoice>,
    @InjectRepository(Appointment)
    private appointmentRep: Repository<Appointment>,
    @InjectRepository(PatientAccount)
    private patientAccountRep: Repository<PatientAccount>,
    @InjectRepository(Test)
    private testRep: Repository<Test>,
    @InjectRepository(PatientTest)
    private patientTestRep: Repository<PatientTest>,
  ) {}

  async getAll(
    user,
    skip: number,
    take: number,
    selectedPage,
    filter?: string,
    sort?: string,
  ): Promise<PatientListResponseDto[]> {
    let lab = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory._id,laboratory.type')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    let lab_number = '';
    if (isNumber(filter)) {
      const facilityModel = await this.facilityRep.findOne({
        select: ['_id', 'unique_id'],
        where: { _id: user.facility_id },
      });
      lab_number = facilityModel.unique_id + '-' + filter;
    }

    let patients = await this.patientRep
      .createQueryBuilder('patient')
      .select(
        'patient._id,patient.age,patient.age_unit,patient.cc_facility_id,patient.gender,patient.mobile_number,patient.name,patient.registration_date,patient.unique_id',
      )
      .where('patient.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .orderBy(transformSortField(sort))
      .skip(skip)
      .take(take)
      .getRawMany();

    patients.forEach(async (patient) => {
      Object.assign(patient, { lab_number, from_cc: false });
      const invoice = await this.invoiceRep
        .createQueryBuilder('invoice')
        .where('invoice.patient_id = :patient_id', { patient_id: patient._id })
        .getRawOne();

      const appointment = await this.appointmentRep
        .createQueryBuilder('appointment')
        .where('appointment.patient_id = :patient_id', {
          patient_id: patient._id,
        })
        .getRawOne();

      if (invoice) {
        Object.assign(patient, { invoice_status: invoice.status });
      }

      if (appointment) {
        Object.assign(patient, { is_completed: appointment.is_completed });
      }
    });

    const result = {
      data: patients,
      metadata: {
        total: patients.length,
        page: selectedPage,
      },
    };

    return [result];
  }

  async getSingle(id: string, user): Promise<any> {
    const patient = await this.patientRep
      .createQueryBuilder('patient')
      .select(
        'patient.address,patient.age,patient.age_unit,patient.city,patient.created_at,patient.dob,patient.facility_id,patient.gender,patient.mobile_number,patient.name,patient.patient_account_id,patient.registration_date,patient.rep_pin,patient.unique_id,patient._id,patient.updated_at',
      )
      .where('patient._id = :_id', { _id: id })
      .getRawOne();

    const appointment = await this.appointmentRep
      .createQueryBuilder('appointment')
      .select('appointment.*')
      .where('appointment.patient_id = :patient_id', {
        patient_id: patient._id,
      })
      .getRawOne();

    const patientAccount = await this.patientAccountRep.findOne({
      select: ['name', '_id', 'unique_id'],
      where: { _id: patient.patient_account_id },
    });

    const {
      is_completed,
      lab_number,
      reference_id,
      reference_number,
      appointment_date,
      appointment_time,
      type,
      _id,
    } = appointment;
    const appointment_info = {
      lab: {
        invoice_status: 1,
        lab_number,
        reference_id,
        reference_number,
        is_completed,
      },
    };

    const patientTests = await this.patientTestRep
      .createQueryBuilder('patient_test')
      .select('patient_test.*')
      .where('patient_test.patient_id = :patient_id', {
        patient_id: patient._id,
      })
      .getRawMany();

    const invoices = await this.invoiceRep
      .createQueryBuilder('invoice')
      .select('invoice.*')
      .where('invoice.patient_id = :patient_id', { patient_id: patient._id })
      .getRawMany();

    let tests = [];
    for (let i = 0; i < patientTests.length; i++) {
      let pt = patientTests[i];

      let savedTest: any = await this.testRep
        .createQueryBuilder('test')
        .select(
          'test.test_category_id as category_id,test.name,test.status,test.sequence,test.title_for_print,test._id,tg.name as category_name,tg.type as category_type',
        )
        .leftJoin('test_category', 'tg', 'tg._id = test.test_category_id')
        .where('test._id = :_id', { _id: pt.test_id })
        .getRawMany();

      if (savedTest) {
        savedTest.forEach((test) => {
          Object.assign(test, {
            sample_status: pt.sample_status,
            is_printed: pt.is_printed,
          });
          tests.push(test);
        });
      }
    }

    let appointmentsWithDetails = [
      {
        appointment_date,
        appointment_time,
        type,
        _id,
        lab_number,
        reference_number,
        tests,
        invoices,
        deletedTests: [], // for this do deletedTests apis
      },
    ];
    Object.assign(
      patient,
      { appointment_info: appointment_info },
      { patientAccount },
      { appointmentsWithDetails },
      {
        notification_statuses: {
          sms: {
            reports_done: false,
          },
        },
      },
      {
        created_at: patient.created_at.getTime(),
        updated_at: patient.updated_at.getTime(),
        created_by: user._id,
        created_by_name: user.full_name || '',
        updated_by: user._id,
        referenceNumber: [{ _id: '', reference_number: '' }],
      },
    );
    return patient;
  }

  async update(id: string, body: UpdatePatientRequestDto, user): Promise<any> {
    const patient = await this.patientRep
      .createQueryBuilder('patient')
      .select('patient.*')
      .where('patient._id = :_id', { _id: id })
      .andWhere('patient.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    if (patient) {
      if (body.mobile_number !== patient.mobile_number) {
        const patientAccModel = await this.patientAccountRep
          .createQueryBuilder('patient_account')
          .select('patient_account.*')
          .where(
            'patient_account.registration_facility_id = :registration_facility_id',
            { registration_facility_id: user.facility_id },
          )
          .andWhere('patient_account.mobile_number = :mobile_number', {
            mobile_number: body.mobile_number,
          })
          .getRawOne();

        if (patientAccModel) {
          Object.assign(body, { patient_account_id: patientAccModel._id });
        } else {
          const level1Facility = await this.facilityRep
            .createQueryBuilder('facility')
            .select('facility.*')
            .where('facility._id = :_id', { _id: user.facility_id })
            .getRawOne();

          let parent_facility_id = level1Facility?._id;
          if (level1Facility.parent_facility_id) {
            parent_facility_id = level1Facility.parent_facility_id;
          }

          let patientAccountAttributes = {
            parent_facility_id,
            registration_facility_id: user.facility_id,
            mobile_number: body.mobile_number,
            name: body.name,
            dob: body.dob,
            gender: body.gender,
            address: body.address,
            city: body.city,
            email: body.email,
          };
          const savedPatientAccount = await this.patientAccountRep.update(
            patientAccModel._id,
            patientAccountAttributes,
          );
          if (savedPatientAccount.affected > 0) {
            Object.assign(body, { patient_account_id: patientAccModel._id });
          }
        }
      }

      const savedPatient = await this.patientRep.update(patient._id, body);
      if (savedPatient.affected > 0) {
      }
    }
  }
}