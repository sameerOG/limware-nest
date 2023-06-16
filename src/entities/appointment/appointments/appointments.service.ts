import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Error } from 'src/common/global-dto.dto';
import { Facility } from 'src/entities/Facility/facility.entity';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { LabTestRateList } from 'src/entities/lab_test_rate/lab_test_rate_list.entity';
import { LabTestRateListItem } from 'src/entities/lab_test_rate/lab_test_rate_list_item.entity';
import { Patient } from 'src/entities/patient/patient.entity';
import { PatientAccount } from 'src/entities/patient/patient_account.entity';
import { Reference } from 'src/entities/reference/reference.entity';
import { Test } from 'src/entities/test/test.entity';
import { TestCategory } from 'src/entities/test/test_category.entity';
import { Repository } from 'typeorm';
import { Appointment } from '../appointment.entity';
import {
  AddAppointmentRequestDto,
  AddTestDto,
  DeleteTestDto,
  SearchPatientRequest,
  UpdateAppointmentReference,
} from '../dto/request.dto';
import { isEmpty } from 'lodash';
import {
  AddAppointmentResponseDto,
  GetAllReferences,
  GetAllTests,
  GetReferenceAppointment,
  PatientTestForDeleteResponseDto,
  SearchPatient,
} from '../dto/response.dto';
import { Invoice } from 'src/entities/invoice/invoice.entity';
import { Addons } from 'src/entities/addons/addons.entity';
import { PatientTest } from 'src/entities/patient/patient_test.entity';
import { TestNormalRange } from 'src/entities/test/test_normal_range.entity';
import { TestParameter } from 'src/entities/test/test_parameter.entity';
import { PatientTestParameterResult } from 'src/entities/patient/patient_test_parameter_result.entity';
import { PaymentTRansaction } from 'src/entities/pricing/payment_transaction.entity';
import { InvoiceLineItem } from 'src/entities/invoice/invoice_line_item.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Laboratory)
    private labRep: Repository<Laboratory>,
    @InjectRepository(Appointment)
    private appointmentRep: Repository<Appointment>,
    @InjectRepository(Test)
    private testRep: Repository<Test>,
    @InjectRepository(TestCategory)
    private testCategoryRep: Repository<TestCategory>,
    @InjectRepository(LabTestRateList)
    private labTestRateListRep: Repository<LabTestRateList>,
    @InjectRepository(LabTestRateListItem)
    private labTestRateListItemRep: Repository<LabTestRateListItem>,
    @InjectRepository(Reference)
    private referenceRep: Repository<Reference>,
    @InjectRepository(Facility)
    private facilityRep: Repository<Facility>,
    @InjectRepository(PatientAccount)
    private patientAccountRep: Repository<PatientAccount>,
    @InjectRepository(Patient)
    private patientRep: Repository<Patient>,
    @InjectRepository(Addons)
    private addonsRep: Repository<Addons>,
    @InjectRepository(Invoice)
    private invoiceRep: Repository<Invoice>,
    @InjectRepository(PatientTest)
    private patientTestRep: Repository<PatientTest>,
    @InjectRepository(TestNormalRange)
    private testNormalRangeRep: Repository<TestNormalRange>,
    @InjectRepository(TestParameter)
    private testParameterRep: Repository<TestParameter>,
    @InjectRepository(PaymentTRansaction)
    private paymentTransactionRep: Repository<PaymentTRansaction>,
    @InjectRepository(InvoiceLineItem)
    private invoiceLineItemRep: Repository<InvoiceLineItem>,
    @InjectRepository(PatientTestParameterResult)
    private patientTestParameterResultRep: Repository<PatientTestParameterResult>,
  ) {}

  async add(body: AddAppointmentRequestDto, user): Promise<any> {
    const labModal = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    const level1Facility = await this.facilityRep.findOne({
      where: { _id: user.facility_id },
      relations: ['parent_facility_id'],
    });
    let parent_facility_id: string = level1Facility?._id;
    if (level1Facility?.parent_facility_id) {
      parent_facility_id = level1Facility.parent_facility_id._id;
    }

    let laboratory_id = labModal?._id;
    if (labModal?.type === 'cc') {
      laboratory_id = labModal.parent_lab_id;
    }

    if (!labModal) {
      throw 'Cannot save appointment, laboratory type is not set.';
    }

    const patient_account_id = await this.__findOrCreatePatientAccount(
      parent_facility_id,
      user.facility_id,
      body,
    );
    const patient = await this.__createPatient(
      parent_facility_id,
      user.facility_id,
      patient_account_id,
      body,
      labModal?.type,
    );
    const appointment = await this.__createAppointment(
      parent_facility_id,
      user.facility_id,
      patient_account_id,
      patient._id,
      laboratory_id,
      body,
      labModal?.type,
    );
    const invoice = await this.__createInvoice(
      user.facility_id,
      patient_account_id,
      patient,
      appointment._id,
      body,
    );
    await this.__createPaymentTransaction(user.facility_id, invoice._id, body);
    await this.__registerPatientTests(
      parent_facility_id,
      user.facility_id,
      laboratory_id,
      patient_account_id,
      patient._id,
      appointment._id,
      body,
      labModal?.type,
    );
    return patient;
    // const {...rest} = patient
    // return new AddAppointmentResponseDto({
    //   ...rest,
    //   updated_by:user._id,
    //   created_at:patient.created_at.getTime(),
    //   updated_at:patient.updated_at.getTime()
    // })
  }

  async getReference(id: string): Promise<GetReferenceAppointment> {
    const data = await this.appointmentRep.findOne({
      select: ['reference_id'],
      where: { _id: id },
    });
    return data ? data : { reference_id: '' };
  }

  async updateReference(
    id: string,
    body: UpdateAppointmentReference,
  ): Promise<Appointment> {
    const data: any = await this.appointmentRep
      .createQueryBuilder('appointment')
      .select('appointment.*')
      .where('appointment._id = :_id', { _id: id })
      .getRawOne();

    if (data) {
      data.reference_id = body.reference_id;
      await this.appointmentRep.update(id, body);
      return data;
    } else {
      return null;
    }
  }

  async __findOrCreatePatientAccount(
    parent_facility_id: string,
    registration_facility_id: string,
    data,
  ): Promise<string> {
    if (!isEmpty(data.mobile_number)) {
      const patientAccount = await this.patientAccountRep
        .createQueryBuilder('patient_account')
        .select('patient_account.*')
        .where('patient_account.parent_facility_id = :parent_facility_id', {
          parent_facility_id,
        })
        .andWhere('patient_account.mobile_number = :mobile_number', {
          mobile_number: data.mobile_number,
        })
        .getRawOne();

      if (patientAccount) {
        return patientAccount._id;
      } else {
        const {
          name,
          mobile_number,
          dob,
          gender,
          address,
          city,
          guardian_type,
          guardian_name,
          guardian_mobile_number,
        } = data;
        let patientAccountAttributes: any = {
          parent_facility_id,
          registration_facility_id,
          mobile_number,
          name,
          dob,
          gender,
          address,
          city,
        };

        if (!isEmpty(guardian_type) && !isEmpty(guardian_name)) {
          const guardian_info = {
            guardian_type,
            guardian_mobile_number,
            guardian_name,
          };
          Object.assign(patientAccountAttributes, {
            guardian_info,
          });
        }
        const savedData = await this.patientAccountRep.save(
          patientAccountAttributes,
        );
        return savedData ? savedData._id : '';
      }
    } else {
      return '';
    }
  }

  async __createPatient(
    parent_facility_id: string,
    facility_id: string,
    patient_account_id: string,
    data,
    labType,
  ): Promise<Patient> {
    let notificationStatusesSetup = null;
    const addonsModel = await this.addonsRep
      .createQueryBuilder('addons')
      .select('addons.*')
      .where('addons.facility_id = :facility_id', { facility_id })
      .getRawOne();

    if (addonsModel) {
      notificationStatusesSetup = [];
      if (addonsModel.sms?.status) {
        notificationStatusesSetup.sms = [];
        Object.keys(addonsModel['sms']['settings']).forEach(function (key) {
          var value = addonsModel['sms']['settings'][key];
          if (value) {
            notificationStatusesSetup['sms'][key] = false;
          }
        });
      }

      if (addonsModel.whatsapp?.status) {
        notificationStatusesSetup.whatsapp = [];
        Object.keys(addonsModel['whatsapp']['settings']).forEach(function (
          key,
        ) {
          var value = addonsModel['whatsapp']['settings'][key];
          if (value) {
            notificationStatusesSetup['whatsapp'][key] = false;
          }
        });
      }
    }

    const report_pin = Math.random();
    const {
      mobile_number,
      name,
      dob,
      age,
      age_unit,
      gender,
      address,
      city,
      guardian_type,
      guardian_name,
      guardian_mobile_number,
    } = data;
    let patientAttributes: any = {
      facility_id: null,
      patient_account_id,
      registration_date: new Date().getTime(),
      mobile_number,
      name,
      dob,
      age,
      age_unit,
      gender,
      city,
      address,
      notification_statuses: notificationStatusesSetup
        ? notificationStatusesSetup
        : null,
      rep_pin: report_pin,
      appointmentInfo: {
        lab: {
          lab_number: null,
          is_completed: false,
          invoice_status: null,
          reference_number: null,
          reference_id: null,
        },
      },
    };

    if (labType === 'main' || labType === 'branch') {
      Object.assign(patientAttributes, { facility_id });
    } else if (labType === 'cc') {
      Object.assign(patientAttributes, {
        facility_id: parent_facility_id,
        cc_facility_id: facility_id,
      });
    } else {
      throw 'Cannot save patient, laboratory type is not set.';
    }

    if (!isEmpty(guardian_type) && !isEmpty(guardian_name)) {
      const guardian_info = {
        guardian_type,
        guardian_name,
        guardian_mobile_number,
      };

      Object.assign(patientAttributes, guardian_info);
    }
    const savedData = await this.patientRep.save(patientAttributes);
    if (savedData) {
      return savedData;
    } else {
      throw 'Cannot save patient';
    }
  }

  async __createAppointment(
    parent_facility_id: string,
    facility_id: string,
    patient_account_id: string,
    patient_id: string,
    laboratory_id: string,
    data: AddAppointmentRequestDto,
    labType,
  ): Promise<Appointment> {
    const { reference_number, reference_id } = data;
    let appointmentAttributes: any = {
      facility_id: null,
      patient_account_id,
      patient_id,
      type: 1,
      laboratory_id,
      appointment_date: String(new Date().getTime()),
      reference_number: isEmpty(reference_number) ? null : reference_number,
      reference_id,
    };

    if (labType === 'main' || labType === 'branch') {
      Object.assign(appointmentAttributes, { facility_id });
    } else if (labType === 'cc') {
      Object.assign(appointmentAttributes, {
        facility_id: parent_facility_id,
        cc_facility_id: facility_id,
      });
    } else {
      throw 'Cannot save appointment, laboratory type is not set.';
    }

    // setLabAndAppointmentNumber (check php code for this)
    const savedData = await this.appointmentRep.save(appointmentAttributes);
    if (savedData) {
      let referenceId = !isEmpty(savedData?.reference_id)
        ? savedData.savedData
        : null;
      const attributes = {
        lab_number: savedData.lab_number,
        reference_number: savedData.reference_number,
        reference_id: referenceId,
      };

      await this.updateAppointmentInfo(patient_id, attributes);
      return savedData;
    }
  }

  async __createInvoice(
    facility_id: string,
    patient_account_id: string,
    patient: Patient,
    appointment_id: string,
    data: AddAppointmentRequestDto,
  ): Promise<Invoice> {
    const { total_amount, discount_amount, invoiceLineItems, paid_amount } =
      data;
    let total_payable_amount = total_amount - discount_amount;
    let status;
    if (total_payable_amount - paid_amount === 0) {
      status = 3;
    } else if (
      total_payable_amount - paid_amount != 0 &&
      total_payable_amount - paid_amount != total_payable_amount
    ) {
      status = 2;
    } else {
      status = 1;
    }
    let invoiceAttributes: any = {
      facility_id,
      patient_account_id,
      patient_id: patient._id,
      appointment_id,
      status,
      title: patient.name,
      invoice_date: String(new Date().getTime()),
      description: '',
      total_amount,
      discount_amount,
      total_payable_amount,
      paid_amount: paid_amount,
      due_amount: total_payable_amount - paid_amount,
    };

    const savedData = await this.invoiceRep.save(invoiceAttributes);
    if (savedData) {
      await this.__createInvoiceLineItems(
        facility_id,
        savedData._id,
        invoiceLineItems,
      );
      return savedData;
    } else {
      throw 'Cannot save invoice';
    }
  }

  async __createPaymentTransaction(
    facility_id: string,
    invoice_id: string,
    data: AddAppointmentRequestDto,
  ) {
    const { paid_amount } = data;

    if (paid_amount > 0) {
      let ptAttributes: any = {
        facility_id,
        invoice_id,
        amount: paid_amount,
        payment_method: 1,
        type: 1,
      };
      const savedData = await this.paymentTransactionRep.save(ptAttributes);
      if (savedData) {
        return ptAttributes;
      } else {
        throw 'Cannot save payment transaction';
      }
    } else {
      await this.updateInvoiceAmountsAfterSave(invoice_id);
    }
  }

  async __registerPatientTests(
    parent_facility_id: string,
    facility_id: string,
    laboratory_id: string,
    patient_account_id: string,
    patient_id: string,
    appointment_id: string,
    data: AddAppointmentRequestDto,
    labType,
  ) {
    const { invoiceLineItems } = data;

    invoiceLineItems.forEach(async (item) => {
      let testModel: Test = await this.testRep
        .createQueryBuilder('test')
        .select('test.*')
        .where('test._id = :_id', { _id: item.test_id })
        .getRawOne();

      const attributes: any = {
        facility_id: null,
        laboratory_id,
        patient_account_id,
        patient_id,
        appointment_id,
        test_id: item.test_id,
        test_category_id: testModel.test_category_id,
        notes: testModel.default_notes,
        status: 1,
        sample_location: item.sample_location,
      };

      if (labType === 'cc') {
        Object.assign(attributes, { facility_id, sample_status: 5 });
      } else {
        Object.assign(attributes, {
          facility_id: parent_facility_id,
          sample_status: 10,
        });
      }

      const savedData = await this.patientTestRep.save(attributes);
      if (savedData) {
        await this.__registerPatientTestsParameters(
          testModel,
          facility_id,
          laboratory_id,
          savedData._id,
        );
      } else {
        throw 'Cannot save patient test';
      }
    });
  }

  async __registerPatientTestsParameters(
    testModel: Test,
    facility_id: string,
    laboratory_id: string,
    patient_test_id: string,
  ) {
    let testParameters = [];
    let nrIds;
    if (testModel.single_or_group === 'single') {
      const normalRanges = await this.testNormalRangeRep
        .createQueryBuilder('test_normal_range')
        .select('test_normal_range.*')
        .where('test_normal_range.test_id = :test_id', {
          test_id: testModel._id,
        })
        .getRawMany();
      nrIds = await this._getNormalRangesIds(normalRanges);
      testParameters.push({
        test: testModel,
        parameter: null,
        normal_ranges_ids: nrIds,
      });
    } else {
      const testParameterChild = await this.testParameterRep
        .createQueryBuilder('test_parameter')
        .select('test_parameter.*')
        .where('test_parameter.child_test_id = :child_test_id', {
          child_test_id: testModel._id,
        })
        .getRawMany();

      for (let i = 0; i < testParameterChild.length; i++) {
        const normalRanges = await this.testNormalRangeRep
          .createQueryBuilder('test_normal_range')
          .select('test_normal_range.*')
          .where('test_normal_range.test_id = :test_id', {
            test_id: testParameterChild[i].child_test_id,
          })
          .getRawMany();
        const childTest = await this.testRep
          .createQueryBuilder('test')
          .select('test.*')
          .where('test._id = :_id', {
            _id: testParameterChild[i].child_test_id,
          })
          .getRawOne();
        nrIds = await this._getNormalRangesIds(normalRanges);
        testParameters.push({
          test: childTest,
          parameter: testParameterChild[i],
          normal_ranges_ids: nrIds,
        });
      }
    }

    testParameters.forEach(async (test) => {
      const attributes: any = {
        facility_id,
        laboratory_id,
        patient_test_id,
        test_id: test._id,
        test_parameter_id: test.parameter ? test.parameter : null,
        result: null,
        status: 1,
        normal_ranges_ids: test.normal_ranges_ids,
        widal_result: '',
      };

      const savedData = await this.patientTestParameterResultRep.save(
        attributes,
      );
      if (!savedData) {
        throw 'Cannot save patient test parameter';
      }
    });
  }

  async _getNormalRangesIds(normalRanges) {
    let nrIds = [];
    normalRanges.forEach((nr) => {
      nrIds.push(nr._id);
    });
    return nrIds;
  }

  async updateInvoiceAmountsAfterSave(invoice_id: string) {
    let invoiceModel = await this.invoiceRep.findOne({
      where: { _id: invoice_id },
    });
    let allPayments = await this.paymentTransactionRep.find({
      where: { invoice_id: invoiceModel._id },
    });
    let paid_amount = 0;
    let due_amount = 0;
    for (let i = 0; i < allPayments.length; i++) {
      paid_amount = paid_amount + allPayments[i].amount;
    }

    due_amount =
      invoiceModel.total_amount - (paid_amount + invoiceModel.discount_amount);
    invoiceModel.paid_amount = paid_amount;
    invoiceModel.due_amount = due_amount;
    invoiceModel.total_payable_amount =
      invoiceModel.total_amount - invoiceModel.discount_amount;

    if (invoiceModel.due_amount === 0) {
      invoiceModel.status = 3;
    } else if (invoiceModel.paid_amount === 0) {
      invoiceModel.status = 1;
    } else {
      invoiceModel.status = 2;
    }

    await this.invoiceRep.update(invoiceModel._id, invoiceModel);
    await this.updateAppointmentInfo(invoiceModel.patient_id, {
      invoice_status: invoiceModel.status,
    });
  }

  async __createInvoiceLineItems(
    facility_id: string,
    invoice_id: string,
    invoiceLineItems,
  ) {
    for (let i = 0; i < invoiceLineItems.length; i++) {
      const invoiceLineItemAttributes: any = {
        facility_id,
        invoice_id,
        test_id: invoiceLineItems[i].test_id,
        title: invoiceLineItems[i].title_for_print,
        amount: invoiceLineItems[i].price,
        remarks: invoiceLineItems[i].remarks,
      };
      const savedData = await this.invoiceLineItemRep.save(
        invoiceLineItemAttributes,
      );
      if (!savedData) {
        throw 'Cannot save invoice line item';
      }
    }
  }

  async updateAppointmentInfo(patient_id: string, fields) {
    let patModel = await this.patientRep.findOne({
      where: { _id: patient_id },
    });
    let appointmentInfoObj = patModel?.appointment_info;
    if (appointmentInfoObj) {
      Object.keys(fields).forEach((key) => {
        let value = fields[key];
        appointmentInfoObj['lab'][key] = value;
      });
      patModel.appointment_info = appointmentInfoObj;
      return await this.patientRep.update(patModel._id, patModel);
    }
  }

  async getAllTests(user): Promise<GetAllTests[]> {
    const labModal = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    let laboratory_id = labModal?._id;

    if (labModal?.type === 'cc') {
      const mainLabModal = await this.labRep
        .createQueryBuilder('laboratory')
        .select('laboratory.*')
        .where('laboratory.parent_lab_id = :parent_lab_id', {
          parent_lab_id: labModal.parent_lab_id,
        })
        .getRawOne();

      laboratory_id = mainLabModal?._id;
    }

    const rateListModal = await this.labTestRateListRep
      .createQueryBuilder('lab_test_rate_list')
      .select('lab_test_rate_list.*')
      .where('lab_test_rate_list.laboratory_id = :laboratory_id', {
        laboratory_id,
      })
      .andWhere('lab_test_rate_list.status = :status', { status: 1 })
      .getRawOne();

    let rateListItemModal = [];
    if (rateListModal) {
      rateListItemModal = await this.labTestRateListItemRep
        .createQueryBuilder('lab_test_rate_list_item')
        .select('lab_test_rate_list_item.*')
        .where(
          'lab_test_rate_list_item.lab_test_rate_list_id = :lab_test_rate_list_id',
          { lab_test_rate_list_id: rateListModal._id },
        )
        .getRawMany();
    }

    let returnResult = [];

    const tests = await this.testRep
      .createQueryBuilder('test')
      .select('test.*')
      .where('test.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .andWhere('test.archived = :archived', { archived: false })
      .getRawMany();

    const templateTests = await this.testRep
      .createQueryBuilder('test')
      .select('test.*')
      .where('test.is_template = :is_template', {
        is_template: 1,
      })
      .andWhere('test.archived = :archived', { archived: false })
      .getRawMany();

    const finalTests = [...templateTests, ...tests];

    for (let j = 0; j < finalTests.length; j++) {
      let testToPush = {
        _id: finalTests[j]._id,
        name: finalTests[j].name,
        code: finalTests[j].code || '',
        title_for_print: finalTests[j].title_for_print,
        price: 0,
        category: '',
        tags: finalTests[j].tags,
      };

      for (let k = 0; k < rateListItemModal.length; k++) {
        if (rateListItemModal[k].test_id === finalTests[j]._id) {
          testToPush.price = rateListItemModal[k].price;
        }
      }

      returnResult.push(testToPush);
    }

    return returnResult;
  }

  async getAllReferences(user): Promise<GetAllReferences[]> {
    const labModal = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    let facility_id = user.facility_id;
    if (labModal?.type === 'cc') {
      facility_id = labModal.facility_id;
    }

    const data = await this.referenceRep
      .createQueryBuilder('reference')
      .select('reference._id,reference.name')
      .where('reference.facility_id = :facility_id', { facility_id })
      .orderBy('reference.name', 'ASC')
      .getRawMany();

    return data;
  }

  async searchPatient(
    user,
    body: SearchPatientRequest,
  ): Promise<SearchPatient> {
    const facility = await this.facilityRep.findOne({
      where: { _id: user.facility_id },
    });
    const parent_facility_id: string = facility?.parent_facility_id
      ? facility?.parent_facility_id
      : user.facility_id;
    const patientAccount: PatientAccount = await this.patientAccountRep
      .createQueryBuilder('patient_account')
      .select('patient_account.*')
      .where('patient_account.parent_facility_id = :parent_facility_id', {
        parent_facility_id,
      })
      .andWhere('patient_account.mobile_number = :mobile_number', {
        mobile_number: body.mobile_number,
      })
      .getRawOne();

    if (patientAccount) {
      const patients = await this.patientRep
        .createQueryBuilder('patient')
        .select(
          'patient._id,patient.name,patient.age,patient.age_unit,patient.gender,patient.mobile_number,patient.unique_id,patient.address,patient.city,patient.dob',
        )
        .where('patient.patient_account_id = :patient_account_id', {
          patient_account_id: patientAccount._id,
        })
        .orderBy('patient.created_at', 'DESC')
        .getRawMany();

      let filteredPatients = [];
      for (let i = 0; i < patients.length; i++) {
        let found = false;
        for (let j = 0; j < filteredPatients.length; j++) {
          if (filteredPatients[j].name === patients[i].name) {
            found = true;
          }
        }

        if (!found) {
          filteredPatients.push(patients[i]);
        }
      }
      return {
        patientAccount,
        patients: filteredPatients,
      };
    } else {
      return null;
    }
  }

  async addTest(body: any, user): Promise<boolean> {
    const labModal = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    const appointment = await this.appointmentRep
      .createQueryBuilder('appointment')
      .select('appointment.*')
      .where('appointment._id = :_id', { _id: body.appointment_id })
      .getRawOne();

    await this.__addTest_UpdateInvoice(body, user.facility_id);
    await this.__createPaymentTransaction(
      user.facility_id,
      body.invoice_id,
      body,
    );
    await this.__registerPatientTests(
      appointment.facility_id,
      appointment.facility_id,
      appointment.laboratory_id,
      appointment.patient_account_id,
      appointment.patient_id,
      appointment._id,
      body,
      labModal?.type,
    );
    await this._updateAppointmentCompletionStatus(appointment._id);
    return true;
  }

  async __addTest_UpdateInvoice(body: AddTestDto, facility_id: string) {
    const invoice = await this.invoiceRep
      .createQueryBuilder('invoice')
      .select('invoice.*')
      .where('invoice._id = :_id', { _id: body.invoice_id })
      .andWhere('invoice.facility_id = :facility_id', { facility_id })
      .getRawOne();

    let total_payable_amount =
      invoice.total_amount -
      invoice.discount_amount +
      (body.total_amount - body.discount_amount);
    let total_amount = invoice.total_amount + body.total_amount;
    let discount_amount = invoice.discount_amount + body.discount_amount;
    let due_amount = body.due_amount;

    invoice.total_payable_amount = total_payable_amount;
    invoice.total_amount = total_amount;
    invoice.discount_amount = discount_amount;
    invoice.paid_amount = invoice.paid_amount + body.paid_amount;
    invoice.due_amount = due_amount;
    if (invoice.paid_amount < invoice.total_payable_amount) {
      invoice.status = 2;
    }

    const savedData = await this.invoiceRep.update(invoice._id, invoice);
    if (savedData.affected > 0) {
      await this.__createInvoiceLineItems(
        facility_id,
        invoice._id,
        body.invoiceLineItems,
      );
    } else {
      throw new HttpException(
        { err: true, messages: 'Cannot update invoice payments' },
        422,
      );
    }
  }

  async _updateAppointmentCompletionStatus(appointment_id: string) {
    const notDoneTestCount = await this.patientTestRep
      .createQueryBuilder('patientTest')
      .where('patientTest.appointment_id = :appointment_id', { appointment_id })
      .andWhere('patientTest.status != :status', { status: 15 })
      .getCount();

    const appointment = await this.appointmentRep.findOne({
      where: { _id: appointment_id },
      relations: ['patient_id'],
    });
    if (notDoneTestCount === 0) {
      appointment.is_completed = true;
    } else {
      appointment.is_completed = false;
    }
    const savedData = await this.appointmentRep.update(
      appointment._id,
      appointment,
    );
    if (savedData.affected > 0) {
      const attributes = { is_completed: appointment.is_completed };
      await this.updateAppointmentInfo(
        appointment?.patient_id?._id,
        attributes,
      );
    }
  }

  async getPatientTestForDelete(
    patient_test_id: string,
    invoice_id: string,
  ): Promise<PatientTestForDeleteResponseDto> {
    const patientTest = await this.patientTestRep
      .createQueryBuilder('patient_test')
      .select('patient_test.*')
      .where('patient_test.test_id = :test_id', { test_id: patient_test_id })
      .getRawOne();

    if (patientTest) {
      if (
        patientTest.status === 1 ||
        patientTest.status === 5 ||
        patientTest.status === 10
      ) {
        return this._getPatientTestForDelete(patientTest, invoice_id);
      } else {
        throw new HttpException(
          { status: false, messages: 'Unable to find test.' },
          422,
        );
      }
    } else {
      throw new HttpException(
        { status: false, messages: 'Unable to find test.' },
        422,
      );
    }
  }

  async _getPatientTestForDelete(
    patientTest: PatientTest,
    invoice_id: string,
  ): Promise<PatientTestForDeleteResponseDto> {
    const invoice = await this.invoiceRep
      .createQueryBuilder('invoice')
      .select('invoice.*')
      .where('invoice._id = :_id', { _id: invoice_id })
      .getRawOne();

    const invoiceLineItem = await this.invoiceLineItemRep
      .createQueryBuilder('invoice_line_item')
      .select('invoice_line_item.*')
      .where('invoice_line_item.test_id = :test_id', {
        test_id: patientTest.test_id,
      })
      .andWhere('invoice_line_item.invoice_id = :invoice_id', { invoice_id })
      .getRawOne();

    const test = await this.testRep
      .createQueryBuilder('test')
      .select('test.*')
      .where('test._id = :_id', { _id: patientTest.test_id })
      .getRawOne();

    return {
      status: true,
      test: {
        patientTest,
        test,
      },
      invoice,
      invoiceLineItem,
    };
  }

  async deletTest(body: DeleteTestDto, user): Promise<boolean> {
    const { patient_test_id } = body;
    const patientTest = await this.patientTestRep
      .createQueryBuilder('patient_test')
      .select('patient_test.*')
      .where('patient_test.test_id = :test_id', {
        test_id: patient_test_id,
      })
      .getRawOne();
    if (patientTest) {
      if (
        patientTest.status === 1 ||
        patientTest.status === 5 ||
        patientTest.status === 10
      ) {
        return this._deleteTest(body, patientTest, user);
      } else {
        throw new HttpException(
          {
            status: false,
            messages: 'Result has been entered. You cannot delete this test.',
          },
          422,
        );
      }
    } else {
      throw new HttpException(
        {
          status: false,
          messages: 'Result has been entered. You cannot delete this test.',
        },
        422,
      );
    }
  }

  async _deleteTest(body: DeleteTestDto, patientTest: PatientTest, user) {
    const { invoice_id, delete_reason } = body;
    const invoice = await this.invoiceRep
      .createQueryBuilder('invoice')
      .select('invoice.*')
      .where('invoice._id = :_id', { _id: invoice_id })
      // .andWhere('invoice.patient_id = :patient_id', {
      //   patient_id: patientTest.patient_id,
      // })
      .getRawOne();

    const invoiceLineItem = await this.invoiceLineItemRep
      .createQueryBuilder('invoice_line_item')
      .select('invoice_line_item.*')
      .where('invoice_line_item.test_id = :test_id', {
        test_id: patientTest.test_id,
      })
      .andWhere('invoice_line_item.invoice_id = :invoice_id', { invoice_id })
      .getRawOne();

    let newAmounts: any = await this.__getNewAmounts(invoice, invoiceLineItem);
    let iliModel = await this.invoiceLineItemRep
      .createQueryBuilder('invoice_line_item')
      .select('invoice_line_item.*')
      .where('invoice_line_item._id = :_id', { _id: invoiceLineItem._id })
      .getRawOne();
    iliModel.delete_reason = delete_reason;
    let res = await this.invoiceLineItemRep.softDelete(iliModel._id);
    if (res.affected > 0) {
      const {
        total_amount,
        due_amount,
        discount_amount,
        paid_amount,
        total_payable_amount,
        status,
      } = newAmounts;
      let invoiceAttributes = {
        total_amount,
        due_amount,
        discount_amount,
        paid_amount,
        total_payable_amount,
        status,
      };
      const savedInvoice = await this.invoiceRep.update(
        invoice._id,
        invoiceAttributes,
      );
      if (savedInvoice.affected > 0) {
        if (newAmounts.return_amount > 0) {
          let ptData = {
            invoice_id: invoice._id,
            amount: newAmounts.return_amount,
            user_comment:
              'Due to test deletion. Reason: ' +
              body.delete_reason +
              body.user_comment,
            type: 2,
          };
          await this.addPayment(ptData, false, user);
        }
        await this.patientTestParameterResultRep
          .createQueryBuilder('patient_test_parameter_result')
          .delete()
          .from(PatientTestParameterResult)
          .where(
            'patient_test_parameter_result.patient_test_id = :patient_test_id',
            { patient_test_id: body.patient_test_id },
          )
          .orWhere('patient_test_parameter_result.test_id = :test_id', {
            test_id: body.patient_test_id,
          })
          .execute();

        let ptModel = await this.patientTestRep
          .createQueryBuilder('patient_test')
          .select('patient_test.*')
          .where('patient_test._id = :_id', { _id: body.patient_test_id })
          .orWhere('patient_test.test_id = :test_id', {
            test_id: body.patient_test_id,
          })
          .getRawOne();

        if (ptModel) {
          ptModel.delete_reason = body.delete_reason;
          ptModel.user_comment = body.user_comment;
          await this.patientTestRep.update(patientTest._id, ptModel);
          await this.patientTestRep.softDelete(patientTest._id);
        }
        await this._updateAppointmentCompletionStatus(invoice.appointment_id);
        await this.updateAppointmentInfo(body.patient_test_id, {
          invoice_status: invoice.status,
        });
        return true;
      }
    }
  }

  async __getNewAmounts(invoice: Invoice, invoiceLineItem: InvoiceLineItem) {
    let rollbackAmount = invoiceLineItem.amount;
    let newTotalAmount = invoice.total_amount - rollbackAmount;
    let newAmounts = {
      total_amount: newTotalAmount,
      due_amount: invoice.due_amount,
      discount_amount: invoice.discount_amount,
      paid_amount: invoice.paid_amount,
      return_amount: 0,
      status: 1,
    };

    if (newAmounts.due_amount > 0) {
      if (newAmounts.due_amount >= rollbackAmount) {
        newAmounts.due_amount = newAmounts.due_amount - rollbackAmount;
        rollbackAmount = 0;
      } else {
        rollbackAmount = rollbackAmount - newAmounts.due_amount;
        newAmounts.due_amount = 0;
      }
    }

    if (rollbackAmount > 0 && newAmounts.discount_amount > 0) {
      if (newAmounts.discount_amount >= rollbackAmount) {
        newAmounts.discount_amount =
          newAmounts.discount_amount - rollbackAmount;
        rollbackAmount = 0;
      } else {
        rollbackAmount = rollbackAmount - newAmounts.discount_amount;
        newAmounts.discount_amount = 0;
      }
    }

    if (rollbackAmount > 0 && newAmounts.paid_amount >= 0) {
      newAmounts.paid_amount = newAmounts.paid_amount - rollbackAmount;
      newAmounts.return_amount = rollbackAmount;
    }

    Object.assign(newAmounts, {
      total_payable_amount:
        newAmounts.total_amount - newAmounts.discount_amount,
    });
    if (newAmounts.due_amount === 0) {
      newAmounts.status = 3;
    } else if (newAmounts.paid_amount === 0) {
      newAmounts.status = 1;
    } else {
      newAmounts.status = 2;
    }

    return newAmounts;
  }

  async addPayment(data, returnInvoice, user) {
    const attributes: any = {
      facility_id: user.facility_id,
      invoice_id: data.invoice_id,
      amount: data.type === 1 ? data.amount : data.amount * -1,
      payment_method: 1,
      user_comment: data.user_comment,
      type: data.type,
    };

    const savedData = await this.paymentTransactionRep.save(attributes);
    if (savedData) {
      if (returnInvoice) {
        return await this.invoiceRep
          .createQueryBuilder('invoice')
          .select('invoice.*')
          .where('invoice._id = :_id', { _id: data.invoice_id })
          .getRawOne();
      } else {
        return savedData;
      }
    }
  }
  async todayPendingPatients(patient_id): Promise<Appointment | undefined> {
    const data = await this.invoiceRep.query(
      `select * from public.appointment where patient_id = '${patient_id}' and is_completed = false`,
    );
    return data;
  }

  async getPatientCompletedTestForDelete(
    patient_test_id: string,
    invoice_id: string,
  ): Promise<any> {
    const patientTest = await this.patientTestRep
      .createQueryBuilder('patient_test')
      .select('patient_test.*')
      .where('patient_test.test_id = :test_id', { test_id: patient_test_id })
      .getRawOne();

    if (patientTest) {
      return this._getPatientTestForDelete(patientTest, invoice_id);
    } else {
      return {
        status: false,
        message: 'Unable to find test',
      };
    }
  }

  async deleteCompletedTest(body: DeleteTestDto, user): Promise<any> {
    const { patient_test_id } = body;
    const patientTest = await this.patientTestRep
      .createQueryBuilder('patient_test')
      .select('patient_test.*')
      .where('patient_test.test_id = :test_id', {
        test_id: patient_test_id,
      })
      .getRawOne();

    if (patientTest) {
      return this._deleteTest(body, patientTest, user);
    } else {
      return {
        status: false,
        message: 'Unable to find test',
      };
    }
  }
}
