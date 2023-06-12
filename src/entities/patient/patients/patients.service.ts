import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty, isNumber } from 'lodash';
import { options } from 'src/common/helper/enums';
import { transformSortField } from 'src/common/utils/transform-sorting';
import { Appointment } from 'src/entities/appointment/appointment.entity';
import { Employee } from 'src/entities/employee/employee.entity';
import { EmployeeFacility } from 'src/entities/employee/employee_facility.entity';
import { EmployeeFacilityDepartment } from 'src/entities/employee/employee_facility_department.entity';
import { Facility } from 'src/entities/Facility/facility.entity';
import { Invoice } from 'src/entities/invoice/invoice.entity';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { LaboratorySetting } from 'src/entities/laboratory/laboratory_setting.entity';
import { TestCategory } from 'src/entities/test/test_category.entity';
import { TestNormalRange } from 'src/entities/test/test_normal_range.entity';
import { Repository } from 'typeorm';
import {
  MarkAsDoneRequestDto,
  printAllRequestDto,
  UpdatePatientRequestDto,
} from '../dto/request.dto';
import {
  MarkAsDoneResponseDto,
  PatientInfoResponseDto,
  PatientListResponseDto,
} from '../dto/response.dto';
import { Patient } from '../patient.entity';
import { PatientAccount } from '../patient_account.entity';
import { PatientTest } from '../patient_test.entity';
import { PatientTestParameterResult } from '../patient_test_parameter_result.entity';
import * as path from 'path';
import * as fs from 'fs';
import { FileHandling } from 'src/common/file-handling';
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
    @InjectRepository(TestCategory)
    private testCategoryRep: Repository<TestCategory>,
    @InjectRepository(EmployeeFacility)
    private empFacilityRep: Repository<EmployeeFacility>,
    @InjectRepository(Employee)
    private empRep: Repository<Employee>,
    @InjectRepository(TestNormalRange)
    private testNormalRangeRep: Repository<TestNormalRange>,
    @InjectRepository(LaboratorySetting)
    private labSettingsRep: Repository<LaboratorySetting>,
    @InjectRepository(PatientTestParameterResult)
    private patientTestParameterResultRep: Repository<PatientTestParameterResult>,
    @InjectRepository(EmployeeFacilityDepartment)
    private empFacilityDepartmentRep: Repository<EmployeeFacilityDepartment>,
    private fileHandling: FileHandling,
  ) {}

  async getAll(
    user,
    skip: number,
    take: number,
    selectedPage,
    filter?: string,
    sort?: string,
  ): Promise<PatientListResponseDto[]> {
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
        'patient._id,appointment.is_completed,patient.age,patient.age_unit,patient.cc_facility_id,patient.gender,patient.mobile_number,patient.name,patient.registration_date,patient.unique_id',
      )
      .leftJoin('patient.appointment', 'appointment')
      .where('patient.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .orderBy(transformSortField(sort))
      .skip(skip)
      .take(take)
      .getRawMany();

    for (let i = 0; i < patients.length; i++) {
      const patient = patients[i];
      Object.assign(patient, { lab_number, from_cc: false });
      const invoice = await this.invoiceRep
        .createQueryBuilder('invoice')
        .select('invoice.*')
        .where('invoice.patient_id = :patient_id', { patient_id: patient._id })
        .getRawOne();

      let invoice_status;
      if (invoice?.status === 1) {
        invoice_status = 'Unpaid';
      } else if (invoice?.status === 2) {
        invoice_status = 'Partially';
      } else if (invoice?.status === 3) {
        invoice_status = 'Paid';
      }

      if (invoice) {
        Object.assign(patient, { invoice_status });
      }
    }

    const result = {
      data: patients,
      metadata: {
        total: patients.length,
        page: selectedPage,
      },
    };

    return [result];
  }

  async getAssignedPatients(
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
        .select('facility._id,facility.unique_id')
        .where('facility._id = :id', { id: user.facility_id })
        .getRawOne();

      lab_number = `${facilityModel.unique_id}-${text}`;
    }

    const employee = await this.empRep
      .createQueryBuilder('employee')
      .select('employee._id')
      .where('employee.user_id = :user_id', { user_id: user._id })
      .andWhere('employee.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    const userAssignedDepartmentIds = await this.getUserDepartments(
      user.facility_id,
      employee._id,
      user,
    );
    let aggregateResult = await this.patientRep
      .createQueryBuilder('patient')
      .select(
        'patient.age,patient.age_unit,patient.created_at,patient.gender,patient.name,patient._id,patient.created_at as registration_date,appointment.is_completed,appointment.lab_number',
      )
      .leftJoin('patient.appointment', 'appointment')
      .where('patient.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .andWhere('patient.deleted_at IS NULL')
      .andWhere(text ? 'patient.name LIKE :name' : '1=1', {
        name: `%${text}%`,
      })
      .skip(skip)
      .take(take)
      .orderBy(transformSortField(sort))
      .getRawMany();

    return aggregateResult;
  }

  async getPatientDetails(patient_id: string, user): Promise<any> {
    const appointment = await this.appointmentRep
      .createQueryBuilder('appointment')
      .select('appointment.*')
      .where('appointment.patient_id = :patient_id', { patient_id: patient_id })
      .andWhere('appointment.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    const patient = await this.patientRep
      .createQueryBuilder('patient')
      .select('patient.*')
      .where('patient._id = :_id', { _id: patient_id })
      .getRawOne();

    const patientTests = await this.patientTestRep
      .createQueryBuilder('patient_test')
      .select('patient_test.*,test.name,test.title_for_print')
      .leftJoin('patient_test.test_id', 'test')
      .where('patient_test.patient_id = :patient_id', { patient_id })
      .getRawMany();

    const userAssignedDepartmentIds = await this.getUserDepartments(
      user.facility_id,
      user.employee_id,
      user,
    );

    let patientTestsFiltered = [];

    for (let i = 0; i < patientTests.length; i++) {
      let ptItem = patientTests[i];
      ptItem.status = ptItem.status;
      ptItem.sample_status = 5;
      for (let j = 0; j < userAssignedDepartmentIds.length; j++) {
        let department_id = userAssignedDepartmentIds[j];
        const test: any = await this.testRep.findOne({
          where: { _id: ptItem.test_id },
          relations: ['test_category_id', 'department_id'],
        });
        const category = await this.testCategoryRep.findOne({
          where: { _id: test.test_category_id._id },
        });
        if (test.department_id?._id === department_id) {
          patientTestsFiltered.push({
            _id: ptItem._id,
            test_category_id: category._id,
            status: ptItem.status,
            sample_location: ptItem.sample_location,
            category_name: category.name,
            category_type: category.type,
            test_id: test._id,
            single_or_group: test.single_or_group,
            test_name: test.name,
            title_for_print: test.title_for_print,
            code: test.code,
            sequence: test.sequence,
            res_input_type: test.res_input_type,
            is_printed: ptItem.is_printed,
            sample_status: ptItem.sample_status,
          });
        }
      }
    }
    if (patientTestsFiltered.length > 0) {
      return {
        appointment,
        patient,
        patient_tests: patientTestsFiltered,
      };
    } else {
      return {
        appointment,
        patient,
        patient_tests: patientTests,
      };
    }
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
          'test.test_category_id as category_id,test.name,test.sequence,test.title_for_print,test._id,tg.name as category_name,tg.type as category_type',
        )
        .leftJoin('test_category', 'tg', 'tg._id = test.test_category_id')
        .where('test._id = :_id', { _id: pt.test_id })
        .getRawMany();

      if (savedTest) {
        savedTest.forEach((test) => {
          Object.assign(test, {
            sample_status: pt.sample_status,
            is_printed: pt.is_printed,
            status: pt.status,
          });
          tests.push(test);
        });
      }
    }

    const deletedTests = await this.patientTestRep
      .createQueryBuilder('patient_test')
      .select(
        'patient_test.delete_reason,patient_test.deleted_at,patient_test.is_printed,patient_test.user_comment,patient_test._id,test.name',
      )
      .withDeleted()
      .leftJoin('patient_test.test_id', 'test')
      .where('patient_test.patient_id = :patient_id', {
        patient_id: patient?._id,
      })
      .andWhere('patient_test.appointment_id = :appointment_id', {
        appointment_id: appointment?._id,
      })
      .andWhere('patient_test.deleted_at IS NOT NULL')
      .getRawMany();

    deletedTests.forEach((info) => {
      Object.assign(info, { deleted_by_full_name: user.full_name });
    });

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
        deletedTests, // for this do deletedTests apis
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

  async update(
    id: string,
    body: UpdatePatientRequestDto,
    user,
  ): Promise<Patient> {
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
      const { reference_number, ...rest } = body;
      const obj = {
        ...rest,
      };
      const savedPatient = await this.patientRep.update(patient._id, obj);
      if (savedPatient.affected > 0) {
        if (!isEmpty(body['patient_account_id'])) {
          let patientTestsModel = await this.patientTestRep
            .createQueryBuilder('patient_test')
            .select('patient_test._id')
            .where('patient_test.patient_id = :patient_id', { patient_id: id })
            .getRawMany();

          let patientTestIds = [];
          patientTestsModel.forEach((ptm) => {
            patientTestIds.push(ptm._id);
          });

          await this.patientTestRep
            .createQueryBuilder()
            .update(PatientTest)
            .set({ patient_account_id: body['patient_account_id'] })
            .whereInIds(patientTestIds)
            .execute();

          const invoiceModel = await this.invoiceRep
            .createQueryBuilder('invoice')
            .select('invoice._id')
            .where('invoice.patient_id = :patient_id', { patient_id: id })
            .getRawMany();

          let invoiceIds = [];
          invoiceModel.forEach((im) => {
            invoiceIds.push(im._id);
          });

          await this.invoiceRep
            .createQueryBuilder()
            .update(PatientTest)
            .set({ patient_account_id: body['patient_account_id'] })
            .whereInIds(invoiceIds)
            .execute();

          if (body.reference_number) {
            let appointmentModel: Appointment = await this.appointmentRep
              .createQueryBuilder('appointment')
              .where('appointment.patient_id = :patient_id', { patient_id: id })
              .getRawOne();

            if (appointmentModel) {
              let appointmentAttr = {
                reference_number: body.reference_number,
              };

              const savedAppointment: any = await this.appointmentRep
                .createQueryBuilder()
                .update(Appointment)
                .set({
                  reference_number: !isEmpty(body.reference_number)
                    ? body.reference_number
                    : null,
                })
                .where({ _id: appointmentModel._id })
                .execute();

              if (savedAppointment.affected > 0) {
                await this.updateAppointmentInfo(id, {
                  reference_number: appointmentModel.reference_number,
                });
              }
            }
          }
        }
      }
    }

    return patient;
  }

  async updateAppointmentInfo(patient_id: string, fields) {
    const patModel = await this.patientRep.findOne({
      where: { _id: patient_id },
    });
    let appointmentInfoObj = patModel?.appointment_info;
    if (appointmentInfoObj) {
      Object.keys(fields).forEach((key) => {
        let value = fields[key];
        appointmentInfoObj['lab'][key] = value;
      });
    }
    patModel.appointment_info = appointmentInfoObj;
    return await this.patientRep.update(patModel._id, patModel);
  }

  async getUserDepartments(
    facility_id: string,
    employee_id: string,
    user,
  ): Promise<string[]> {
    if (!facility_id || !employee_id) {
      facility_id = facility_id ? facility_id : user.facility_id;
      employee_id = employee_id ? employee_id : user.employee_id;
    }

    const employeeLoginFacility = await this.empFacilityRep
      .createQueryBuilder('employee_facility')
      .select('employee_facility.*')
      .where('employee_facility.facility_id = :facility_id', { facility_id })
      .andWhere('employee_facility.employee_id = :employee_id', { employee_id })
      .getRawOne();

    const employeeLoginFacilityDepartment = await this.empFacilityDepartmentRep
      .createQueryBuilder('employee_facility_department')
      .select('employee_facility_department.*')
      .where(
        'employee_facility_department.employee_facility_id = :employee_facility_id',
        { employee_facility_id: employeeLoginFacility._id },
      )
      .getRawMany();

    let userAssignedDepartmentIds = [];
    employeeLoginFacilityDepartment.forEach(
      (item: EmployeeFacilityDepartment) => {
        userAssignedDepartmentIds.push(item.department_id);
      },
    );
    return userAssignedDepartmentIds;
  }

  async markAsDone(
    body: MarkAsDoneRequestDto,
    user,
  ): Promise<MarkAsDoneResponseDto> {
    let returnResult;
    let appointment_id;
    const { patient_id, patient_test_ids } = body;
    const lab = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    const settingModel = await this.labSettingsRep
      .createQueryBuilder('laboratory_setting')
      .select('laboratory_setting.require_results_for_mark_as_done')
      .where('laboratory_setting.laboratory_id = :laboratory_id', {
        laboratory_id: lab?._id,
      })
      .andWhere('laboratory_setting.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();
    for (let i = 0; i < patient_test_ids.length; i++) {
      const patientTestId = patient_test_ids[i];
      let testsStatuses = await this.getResultEnteredCounts(patientTestId);
      if (
        !settingModel.require_results_for_mark_as_done ||
        (settingModel.require_results_for_mark_as_done &&
          testsStatuses.result_not_entered == 0 &&
          testsStatuses.result_entered > 0)
      ) {
        let model = await this.patientTestRep.findOne({
          where: { _id: patientTestId },
        });
        appointment_id = model.appointment_id;
        model.status = 15;
        model.sample_status = 5;
        const savedTest = await this.patientTestRep.update(
          patientTestId,
          model,
        );
        if (savedTest) {
          returnResult = {
            status: true,
            patient_test_status: 15,
          };
        } else {
          returnResult = {
            status: false,
            message: 'Problem updating status.',
          };
        }
      } else {
        if (testsStatuses.result_entered > 1) {
          returnResult = {
            status: false,
            message: 'Results are missing.',
          };
        } else {
          returnResult = {
            status: false,
            message: 'Result is missing.',
          };
        }
      }
    }

    const patientPendingTestsCount = await this.patientTestRep
      .createQueryBuilder('patient_test')
      .where('patient_test.patient_id = :patient_id', { patient_id })
      .andWhere('patient_test.status != :status', { status: 15 })
      .select('patient_test.status')
      .getCount();

    Object.assign(returnResult, {
      allResultsAreDone: patientPendingTestsCount > 0 ? false : true,
    });
    if (appointment_id) {
      await this._updateAppointmentCompletionStatus(appointment_id);
    }
    return returnResult;
  }

  async getResultEnteredCounts(patient_test_id: string) {
    let ptpr = await this.patientTestParameterResultRep
      .createQueryBuilder('patient_test_parameter_result')
      .select(
        'patient_test_parameter_result._id,patient_test_parameter_result.status,patient_test_parameter_result.test_id,test_category.type',
      )
      .leftJoin('patient_test_parameter_result.test_id', 'test')
      .leftJoin('test.test_category_id', 'test_category')
      .where(
        'patient_test_parameter_result.patient_test_id = :patient_test_id',
        { patient_test_id },
      )
      .getRawMany();

    let totalNew = 0;
    let totalResultEntered = 0;
    for (let i = 0; i < ptpr.length; i++) {
      let item = ptpr[i];
      if (item.type !== 'widal') {
        if (item.status === 1) {
          totalNew++;
        } else if (item.status === 5) {
          totalResultEntered++;
        } else {
          totalResultEntered = 1;
        }
      }
    }

    return {
      result_entered: totalResultEntered,
      result_not_entered: totalNew,
    };
  }

  async _updateAppointmentCompletionStatus(appointment_id: string) {
    const notDoneTestCount = await this.patientTestRep
      .createQueryBuilder('patient_test')
      .where('patient_test.appointment_id = :appointment_id', {
        appointment_id,
      })
      .andWhere('patient_test.status != :status', { status: 15 })
      .select('patient_test.status')
      .getCount();

    const model = await this.appointmentRep.findOne({
      where: { _id: appointment_id },
      relations: ['patient_id'],
    });
    if (notDoneTestCount == 0) {
      model.is_completed = true;
    } else {
      model.is_completed = false;
    }

    const savedAppointment = await this.appointmentRep.update(
      appointment_id,
      model,
    );
    if (savedAppointment) {
      await this.updateAppointmentInfo(model.patient_id?._id, {
        is_completed: model.is_completed,
      });
    }
  }

  async getTestParameters(
    patient_test_id: string,
    user,
    patientData?: Patient,
  ): Promise<any> {
    let facility_id = user.facility_id;
    const lab = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();
    if (lab?.type == 'cc') {
      facility_id = lab.parent_facility_id;
    }

    let patientTest = await this.patientTestRep
      .createQueryBuilder('patient_test')
      .select('patient_test.*')
      .where('patient_test._id = :_id', {
        _id: patient_test_id,
      })
      .andWhere('patient_test.facility_id = :facility_id', {
        facility_id: facility_id,
      })
      .getRawOne();
    if (!patientTest) {
      patientTest = await this.patientTestRep
        .createQueryBuilder('patient_test')
        .select('patient_test.*')
        .where('patient_test.test_id = :test_id', {
          test_id: patient_test_id,
        })
        .andWhere('patient_test.facility_id = :facility_id', {
          facility_id: facility_id,
        })
        .getRawOne();
    }

    const testData = await this.testRep.findOne({
      where: { _id: patientTest.test_id },
      relations: ['test_category_id'],
    });

    const ptParameters = await this.patientTestParameterResultRep
      .createQueryBuilder('patient_test_parameter_result')
      .select(
        'patient_test_parameter_result.*,patient_test.test_id as id_from_patient_test',
      )
      .leftJoin('patient_test_parameter_result.patient_test_id', 'patient_test')
      .where(
        'patient_test_parameter_result.patient_test_id = :patient_test_id',
        {
          patient_test_id,
        },
      )
      .getRawMany();

    let patientTestParameters = [];
    let specimens = [];

    for (let i = 0; i < ptParameters.length; i++) {
      let ptParameterItem = ptParameters[i];
      let test_id = ptParameterItem.test_id
        ? ptParameterItem.test_id
        : ptParameterItem.id_from_patient_test;
      const test = await this.testRep
        .createQueryBuilder('test')
        .select('test.*,uom.name as uom_name,specimen.name as specimen_name')
        .leftJoin('test.uom_id', 'uom')
        .leftJoin('test.specimen_id', 'specimen')
        .where('test._id = :_id', {
          _id: test_id,
        })
        .getRawOne();

      const testParameter = await this.patientTestParameterResultRep
        .createQueryBuilder('test_parameter')
        .select('test_parameter.*')
        .where('test_parameter._id = :_id', {
          _id: ptParameterItem.test_parameter_id,
        })
        .getRawOne();
      let testGroup;
      if (testParameter) {
        const testGroupData = await this.patientTestParameterResultRep
          .createQueryBuilder('test_group')
          .select('test_group.*')
          .where('test_group._id = :_id', {
            _id: testParameter?.test_group_id,
          })
          .getRawOne();
        testGroup = testGroupData;
      } else {
        testGroup = null;
      }

      let normalRanges = [];
      // if (
      //   !isEmpty(ptParameterItem.normal_ranges_ids) &&
      //   ptParameterItem.normal_ranges_ids?.length > 0
      // ) {
      //   normalRanges = await this.testNormalRangeRep.find({
      //     where: {
      //       _id: In(ptParameterItem.normal_ranges_ids),
      //     },
      //   });
      // }

      let result = ptParameterItem.result;
      var enforceDecimal = false;
      var decimalLength = 0;

      if (test.res_input_type == 'number_field') {
        if (test.decimal_length && test.decimal_length > 0) {
          enforceDecimal = true;
          decimalLength = test.decimal_length;
        }
      }

      let item = {
        _id: ptParameterItem._id,
        patient_test_id: ptParameterItem.parent_test_id,
        test_parameter_id: ptParameterItem.test_parameter_id,
        test_group_id: testGroup ? testGroup._id : null,
        test_group_name: testGroup ? testGroup.name : null,
        test_group_sequence: testGroup ? testGroup.sequence : null,
        result,
        result_formatted: null,
        is_abnormal: ptParameterItem.is_abnormal,
        status: ptParameterItem.status,
        code: test.code,
        name: test.name,
        title_for_print: test.title_for_print,
        uom_id: test.uom_id,
        uom: test.uom_id ? test.uom_name : null,
        res_input_type: test.res_input_type,
        res_input_options: test.res_input_options,
        sequence: testParameter ? testParameter.sequence : test.sequence,
        normal_ranges: normalRanges,
      };

      if (test.specimen_id) {
        specimens.push(test.specimen_name);
      }

      if (!isEmpty(ptParameterItem.widal_result)) {
        Object.assign(item, { widal_result: ptParameterItem.widal_result });
      }

      patientTestParameters.push(item);
    }

    let specimensStr = '';
    if (specimens.length > 0) {
    }

    let category = testData['test_category_id'];

    let returnData = {
      category,
      patientTest,
      test: testData,
      patientTestParameters,
      specimens,
    };
    return returnData;
  }

  async convertToDraft(parent_test_id: string, status: number) {
    let model = await this.patientTestRep.findOne({
      where: { _id: parent_test_id },
    });
    if (model && status) {
      model.status = status;
      await this.patientTestRep.update(parent_test_id, model);
    }
    await this._updateAppointmentCompletionStatus(model.appointment_id);
    return model;
  }

  async getTodayPatients(
    loggedInUser,
    perpage,
    page,
    sort,
  ): Promise<PatientListResponseDto[]> {
    const laboratory: Laboratory = await this.labRep.query(`
    select * from public.laboratory
    where facility_id = '${loggedInUser.facility_id}'
   `);
    const currentDate = new Date();

    let patients = await this.patientRep
      .createQueryBuilder('patient')
      .select(
        'patient._id,patient.age,patient.age_unit,patient.cc_facility_id,patient.gender,patient.mobile_number,patient.name,patient.registration_date,patient.unique_id,patient.created_at',
      )
      .where('patient.facility_id = :facility_id', {
        facility_id: laboratory[0]?.facility_id,
      })
      .andWhere('DATE(patient.created_at) = :currentDate', { currentDate })
      .orderBy(transformSortField(sort))
      .getRawMany();
    return patients;
  }
  async printAll(body: printAllRequestDto, user): Promise<any> {
    const { patient_id, appointment_id, patient_test_ids } = body;
    const data = await this.getPatientTestData(
      patient_id,
      appointment_id,
      patient_test_ids,
      user,
    );
    // return data;
    let payload: any = {
      data,
    };
    const reportTemplate = 'selected_test_template';
    const content = await this.fileHandling.renderTemplate(
      reportTemplate,
      payload,
    );
    const folderPath = process.cwd() + '/src/common/uploads/invoices';
    const fileName = `${
      data.patient?._id
    }-selected-tests-${new Date().getTime()}.pdf`;
    const filePath = path.join(folderPath, fileName);
    return await this.fileHandling.generatePdf(options, content, filePath);
  }

  async getPatientTestData(
    patient_id: string,
    appointment_id: string,
    patient_test_ids: string[],
    user,
  ) {
    const patientData = await this.patientRep.findOne({
      where: { _id: patient_id },
    });
    let facility_id = patientData.facility_id;
    if (user.facility_id) {
      facility_id = user.facility_id;
    }
    const lab = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: facility_id,
      })
      .getRawOne();

    if (lab?.type === 'cc') {
      facility_id = lab.parent_facility_id;
    }

    const appointmentData = await this.appointmentRep.findOne({
      where: { _id: appointment_id },
    });
    let testsData = [];
    for (let i = 0; i < patient_test_ids.length; i++) {
      let patient_test_id = patient_test_ids[i];
      let data = await this.getTestParameters(patient_test_id, user);
      let organizedParameters = await this.__organizeTests(
        data.patientTestParameters,
      );
      let model = await this.patientTestRep
        .createQueryBuilder('patient_test')
        .select('patient_test.*')
        .where('patient_test.test_id = :test_id', {
          test_id: patient_test_id,
        })
        .getRawOne();
      model.is_printed = 1;
      await this.patientTestRep.update(patient_test_id, model);
      let toPushObj = {
        category: data.category,
        patientTest: data.patientTest,
        test: data.test,
        parameters: organizedParameters,
        specimens: data.specimens,
      };

      if (data.donor) {
        Object.assign(toPushObj, { donor: data.donor });
      }
      testsData.push(toPushObj);
    }
    let testDataCategoryWise = await this.__groupTestsCategoryWise(testsData);
    let reference = 'Self';
    let settingModel = await this.labSettingsRep
      .createQueryBuilder('laboratory_setting')
      .select('laboratory_setting.print_empty_result')
      .where('laboratory_setting.laboratory_id = :laboratory_id', {
        laboratory_id: lab?._id,
      })
      .andWhere('laboratory_setting.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    return {
      patient: patientData,
      appointment: appointmentData,
      categories: testDataCategoryWise,
      reference,
      settings: settingModel,
    };
  }

  async __organizeTests(patientTestParameters: any) {
    let singleTests = [];
    let groups = [];

    for (let i = 0; i < patientTestParameters.length; i++) {
      let item = patientTestParameters[i];
      if (item.test_group_id == null) {
        singleTests.push(item);
      } else {
        let res = await this.__findAndGetIndex(groups, item.test_group_id);
        let index = res.index;
        if (res.isNewGroup) {
          groups.push({
            test_group_id: item.test_group_id,
            test_group_name: item.test_group_name,
            test_group_sequence: item.test_group_sequence,
            tests: [],
          });
        }
        groups[index]['tests'].push(item);
      }
    }

    return {
      singleTests,
      groupedTests: groups,
    };
  }

  async __findAndGetIndex(groups, test_group_id: string) {
    let isNewGroup = true;
    let index = 0;
    for (let i = 0; i < groups.length; i++) {
      let gItem = groups[i];
      if (gItem.test_group_id === test_group_id) {
        isNewGroup = false;
        index = i;
        return {
          isNewGroup,
          index: i,
        };
      }
    }
    return {
      isNewGroup,
      index,
    };
  }

  async __groupTestsCategoryWise(testData) {
    let categories = [];
    for (let i = 0; i < testData.length; i++) {
      let testItem = testData[i];
      let catFound = false;
      let catIndex = 0;
      for (let j = 0; j < categories.length; j++) {
        let catItem = categories[j];
        if (
          !catItem.print_on_separate_page &&
          !testItem['test']['print_on_separate_page']
        ) {
          if (catItem['category']['_id'] === testItem['category']['_id']) {
            catFound = true;
            break;
          }
        }
        catIndex++;
      }
      if (!catFound) {
        let toPushObj = {
          category: testItem.category,
          specimens: testItem.specimens,
          print_on_seperate_page: false,
          report_template: testItem['category']['report_template'],
          tests: [],
        };
        if (testItem.donor) {
          Object.assign(toPushObj, { donor: testItem.donor });
        }
        categories.push(toPushObj);
      }

      if (testItem['test']['print_on_separate_page']) {
        categories[catIndex]['print_on_separate_page'] = true;
        categories[catIndex]['report_template'] =
          testItem['test']['report_template'];
      }

      categories[catIndex]['tests'].push({
        sequence: testItem['test']['sequence'],
        patientTest: testItem.patientTest,
        test: testItem.test,
        parameters: testItem.parameters,
      });
    }
    return categories;
  }

  async getTodayPatientCount(user) {
    const laboratory: Laboratory = await this.labRep.query(`
    select * from public.laboratory
    where facility_id = '${user.facility_id}'
   `);
    const currentDate = new Date();

    const patients = await this.patientRep
      .createQueryBuilder('patient')
      .select(
        'patient._id,patient.age,patient.age_unit,patient.cc_facility_id,patient.gender,patient.mobile_number,patient.name,patient.registration_date,patient.unique_id, created_at',
      )
      .where('patient.facility_id = :facility_id', {
        facility_id: laboratory[0]?.facility_id,
      })
      .andWhere('DATE(patient.created_at) = :currentDate', { currentDate })
      .getRawMany();

    return patients;
  }
}
