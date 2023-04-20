export class EmployeeResponseDto {
  readonly _id: string;
  readonly address: string;
  readonly city: string;
  readonly created_at: number;
  readonly customer_id: string;
  readonly email: string;
  readonly facility_id: string;
  readonly gender: string;
  readonly mobile_number: string;
  readonly name: string;
  readonly status: number;
  readonly updated_at: number;
  readonly updated_by: string;
  readonly cnic: string;
  readonly facility?: Object;

  constructor(emp: EmployeeResponseDto) {
    (this._id = emp._id),
      ((this.address = emp.address),
      (this.city = emp.city),
      (this.created_at = emp.created_at),
      (this.customer_id = emp.customer_id),
      (this.facility_id = emp.facility_id),
      (this.cnic = emp.cnic),
      (this.gender = emp.gender),
      (this.mobile_number = emp.mobile_number),
      (this.name = emp.name),
      (this.status = emp.status),
      (this.updated_at = emp.updated_at),
      (this.updated_by = emp.updated_by),
      (this.facility = emp.facility),
      (this.email = emp.email));
  }
}
