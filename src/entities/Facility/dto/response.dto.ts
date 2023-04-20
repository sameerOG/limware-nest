export class FacilityDto {
  readonly _id: string;
  readonly address: string;
  readonly city: string;
  readonly created_at: number;
  readonly customer_id: string;
  readonly email: string;
  readonly mobile_number: string;
  readonly name: string;
  readonly phone_number: string;
  readonly status: number;
  readonly type: string;
  readonly unique_id: string;
  readonly updated_at: number;
  readonly updated_by: string;
  readonly customer?: Object;
  readonly laboratories?: Object[];

  constructor(user: FacilityDto) {
    (this._id = user._id),
      ((this.name = user.name),
      (this.address = user.address),
      (this.city = user.city),
      (this.created_at = user.created_at),
      (this.customer_id = user.customer_id),
      (this.email = user.email),
      (this.mobile_number = user.mobile_number),
      (this.name = user.name),
      (this.phone_number = user.phone_number),
      (this.type = user.type),
      (this.customer = user.customer),
      (this.laboratories = user.laboratories),
      (this.unique_id = user.unique_id),
      (this.updated_at = user.updated_at),
      (this.updated_by = user.updated_by),
      (this.status = user.status));
  }
}
