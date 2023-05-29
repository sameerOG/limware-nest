import { Invoice } from 'src/entities/invoice/invoice.entity';
import { InvoiceLineItem } from 'src/entities/invoice/invoice_line_item.entity';
import { PatientAccount } from 'src/entities/patient/patient_account.entity';
import { PatientTest } from 'src/entities/patient/patient_test.entity';
import { Test } from 'src/entities/test/test.entity';

export class GetAllTests {
  readonly name: string;
  readonly code: string;
  readonly title_for_print: string;
  readonly category: string;
  readonly _id: Object;
  readonly price: number;
  readonly tags: string | any;

  constructor(test: GetAllTests) {
    (this.name = test.name),
      (this.code = test.code),
      (this.title_for_print = test.title_for_print),
      (this._id = test._id),
      (this.tags = test.tags),
      (this.price = test.price);
  }
}

export class GetAllReferences {
  readonly name: string;
  readonly _id: Object;

  constructor(test: GetAllReferences) {
    (this.name = test.name), (this._id = test._id);
  }
}

export class SearchPatient {
  readonly patientAccount: PatientAccount;
  readonly patients: Patient[];

  constructor(test: SearchPatient) {
    (this.patientAccount = test.patientAccount),
      (this.patients = test.patients);
  }
}

export class Patient {
  readonly _id: string;
  readonly name: string;
  readonly age: string | number;
  readonly age_unit: string;
  readonly gender: string;
  readonly mobile_number: string;
  readonly unique_id: string;
  readonly address: string;
  readonly city: string;
  readonly dob: string | Date;

  constructor(test: Patient) {
    (this._id = test._id),
      (this.name = test.name),
      (this.age = test.age),
      (this.age_unit = test.age_unit),
      (this.gender = test.gender),
      (this.mobile_number = test.mobile_number),
      (this.unique_id = test.unique_id),
      (this.address = test.address),
      (this.dob = test.dob),
      (this.city = test.city);
  }
}

export class AddAppointmentResponseDto {
  readonly address: string;
  readonly age: number;
  readonly age_unit: string;
  readonly city: string;
  readonly created_at: number;
  readonly dob: string;
  readonly facility_id: string;
  readonly gender: string;
  readonly mobile_number: string;
  readonly name: string;
  readonly patient_account_id: string;
  readonly registration_date: number;
  readonly rep_pin: number;
  readonly unique_id: string;
  readonly updated_at: number;
  readonly updated_by: string;
  readonly _id: string;
  readonly notification_statuses?: NotificationStatus;
  readonly appointment_info?: AppointmentInfo;
  readonly guardian_info?: GuardianInfo;

  constructor(appointment: AddAppointmentResponseDto) {
    (this.address = appointment.address),
      (this.age = appointment.age),
      (this.age_unit = appointment.age_unit),
      (this.city = appointment.city),
      (this.created_at = appointment.created_at),
      (this.dob = appointment.dob),
      (this.facility_id = appointment.facility_id),
      (this.gender = appointment.gender),
      (this.mobile_number = appointment.mobile_number),
      (this.name = appointment.name),
      (this.patient_account_id = appointment.patient_account_id),
      (this.registration_date = appointment.registration_date),
      (this.rep_pin = appointment.rep_pin),
      (this.unique_id = appointment.unique_id),
      (this.updated_at = appointment.updated_at),
      (this.updated_by = appointment.updated_by),
      (this.guardian_info = appointment.guardian_info),
      (this.notification_statuses = appointment.notification_statuses),
      (this.appointment_info = appointment.appointment_info),
      (this._id = appointment._id);
  }
}

export class GuardianInfo {
  readonly guardian_mobile_number: string;
  readonly guardian_name: string;
  readonly guardian_type: string;

  constructor(guardian: GuardianInfo) {
    (this.guardian_mobile_number = guardian.guardian_mobile_number),
      (this.guardian_type = guardian.guardian_type),
      (this.guardian_name = guardian.guardian_name);
  }
}

export class AppointmentInfo {
  readonly lab: any;

  constructor(guardian: AppointmentInfo) {
    this.lab = guardian.lab;
  }
}

export class NotificationStatus {
  readonly sms: SMS;

  constructor(notification: NotificationStatus) {
    this.sms = notification.sms;
  }
}

export class SMS {
  readonly reports_done: boolean;

  constructor(sms: SMS) {
    this.reports_done = sms.reports_done;
  }
}

export class PatientTestForDeleteResponseDto {
  readonly invoice: Invoice;
  readonly invoiceLineItem: InvoiceLineItem;
  readonly status: boolean;
  readonly test: TestDto;

  constructor(ptd: PatientTestForDeleteResponseDto) {
    (this.invoice = ptd.invoice),
      (this.invoiceLineItem = ptd.invoiceLineItem),
      (this.test = ptd.test),
      (this.status = ptd.status);
  }
}

export class TestDto {
  readonly patientTest: PatientTest;
  readonly test: Test;

  constructor(test: TestDto) {
    (this.patientTest = test.patientTest), (this.test = test.test);
  }
}
