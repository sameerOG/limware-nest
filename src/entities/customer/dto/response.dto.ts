export class CustomerDto {
  readonly _id: string;
  readonly name: string;
  readonly email: string;
  readonly city: string;
  readonly mobile_number: string;
  readonly status: number;

  constructor(user: CustomerDto) {
    (this._id = user._id), (this.name = user.name), (this.email = user.email);
    this.city = user.city;
    this.mobile_number = user.mobile_number;
    this.status = user.status;
  }
}

export class SingleCustomerDto {
  readonly _id: string;
  readonly name: string;
  readonly email: string;
  readonly city: string;
  readonly mobile_number: string;
  readonly status: number;
  readonly address: string;
  readonly updated_at: number;
  readonly created_at: number;
  readonly updated_by: string;

  constructor(customer: SingleCustomerDto) {
    (this._id = customer._id),
      (this.name = customer.name),
      (this.email = customer.email);
    this.city = customer.city;
    this.mobile_number = customer.mobile_number;
    this.status = customer.status;
    this.address = customer.address;
    this.updated_at = customer.updated_at;
    this.updated_by = customer.updated_by;
    this.created_at = customer.created_at;
  }
}
