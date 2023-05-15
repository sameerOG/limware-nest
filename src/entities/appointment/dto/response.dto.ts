import { PatientAccount } from 'src/entities/patient/patient_account.entity';

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
