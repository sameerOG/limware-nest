export class LabRequestDto {
  readonly _id: string;
  readonly customer_id: string;
  readonly facility_id: string;
  readonly created_at: number;
  readonly mobile_number: string;
  readonly name: string;
  readonly status: number;
  readonly type: string;
  readonly unique_id: string;
  readonly updated_at: number;
  readonly updated_by: string;
  readonly customer?: Object;
  readonly facility?: Object;

  constructor(lab: LabRequestDto) {
    (this._id = lab._id),
      ((this.name = lab.name),
      (this.created_at = lab.created_at),
      (this.facility_id = lab.facility_id),
      (this.customer_id = lab.customer_id),
      (this.mobile_number = lab.mobile_number),
      (this.name = lab.name),
      (this.type = lab.type),
      (this.unique_id = lab.unique_id),
      (this.updated_at = lab.updated_at),
      (this.updated_by = lab.updated_by),
      (this.customer = lab.customer),
      (this.facility = lab.facility),
      (this.status = lab.status));
  }
}

export class LabResponseDto {
  readonly _id: string;
  readonly customer_id: string;
  readonly facility_id: string;
  readonly mobile_number: string;
  readonly name: string;
  readonly status: number;
  readonly type: string;
  readonly unique_id: string;

  constructor(lab: LabResponseDto) {
    (this._id = lab._id),
      ((this.facility_id = lab.facility_id),
      (this.customer_id = lab.customer_id),
      (this.mobile_number = lab.mobile_number),
      (this.name = lab.name),
      (this.type = lab.type),
      (this.unique_id = lab.unique_id),
      (this.status = lab.status));
  }
}
