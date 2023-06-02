export class PatientList {
  readonly age: number;
  readonly age_unit: string;
  readonly cc_facility_id: string | null;
  readonly from_cc: boolean;
  readonly gender: string;
  readonly invoice_status: string;
  readonly is_completed: boolean;
  readonly lab_number: string;
  readonly mobile_number: string;
  readonly name: string;
  readonly registration_date: string | number;
  readonly unique_id: string;
  readonly _id: string;

  constructor(patient: PatientList) {
    (this.age = patient.age),
      (this.age_unit = patient.age_unit),
      (this.cc_facility_id = patient.cc_facility_id),
      (this.from_cc = patient.from_cc),
      (this.gender = patient.gender),
      (this.invoice_status = patient.invoice_status),
      (this.is_completed = patient.is_completed),
      (this.lab_number = patient.lab_number),
      (this.mobile_number = patient.mobile_number),
      (this.name = patient.name),
      (this.registration_date = patient.registration_date),
      (this.unique_id = patient.unique_id),
      (this._id = patient._id);
  }
}

export class MetaData {
  readonly total: number;
  readonly page: number;

  constructor(meta: MetaData) {
    (this.total = meta.total), (this.page = meta.page);
  }
}

export class PatientListResponseDto {
  readonly data: PatientList[];
  readonly metadata: MetaData;

  constructor(patient: PatientListResponseDto) {
    (this.data = patient.data), (this.metadata = patient.metadata);
  }
}

export class PatientInfoResponseDto {
  readonly address: string;
  readonly age: number;
  readonly age_unit: string;
  readonly ccLaboratory: string | null;
  readonly city: string;
  readonly created_at: number;
  readonly created_by: string;
  readonly created_by_name: string;
  readonly dob: string;
  readonly facility_id: string;
  readonly gender: string;
  readonly loggedInUserLabType: string;
  readonly mobile_number: string;
  readonly name: string;
  readonly patient_account_id: string;
  readonly registration_date: string;
  readonly rep_pin: number;
  readonly unique_id: string;
  readonly updated_at: number;
  readonly updated_by: string;
  readonly _id: string;
  readonly appointment_info: AppointmentInfo;
  readonly appointmentsWithDetails: any;
  readonly notification_statuses: any;
  readonly patientAccount: any;

  constructor(patient: PatientInfoResponseDto) {
    (this.address = patient.address),
      (this.age_unit = patient.age_unit),
      (this.ccLaboratory = patient.ccLaboratory),
      (this.city = patient.city),
      (this.created_at = patient.created_at),
      (this.created_by = patient.created_by),
      (this.dob = patient.dob),
      (this.created_by_name = patient.created_by_name),
      (this.facility_id = patient.facility_id),
      (this.gender = patient.gender),
      (this.loggedInUserLabType = patient.loggedInUserLabType),
      (this.name = patient.name),
      (this.patient_account_id = patient.patient_account_id),
      (this.registration_date = patient.registration_date),
      (this.rep_pin = patient.rep_pin),
      (this.unique_id = patient.unique_id),
      (this.updated_at = patient.updated_at),
      (this.updated_by = patient.updated_by),
      (this._id = patient._id),
      (this.mobile_number = patient.mobile_number),
      (this.appointment_info = patient.appointment_info),
      (this.appointmentsWithDetails = patient.appointmentsWithDetails),
      (this.notification_statuses = patient.notification_statuses),
      (this.patientAccount = patient.patientAccount),
      (this.age = patient.age);
  }
}

export class LabInfo {
  readonly invoice_status: number;
  readonly is_completed: boolean;
  readonly lab_number: string;
  readonly reference_id: string | null;
  readonly reference_number: string;

  constructor(patient: LabInfo) {
    (this.invoice_status = patient.invoice_status),
      (this.lab_number = patient.lab_number),
      (this.reference_id = patient.reference_id),
      (this.reference_number = patient.reference_number),
      (this.is_completed = patient.is_completed);
  }
}

export class AppointmentInfo {
  readonly lab: LabInfo;

  constructor(patient: AppointmentInfo) {
    this.lab = patient.lab;
  }
}
