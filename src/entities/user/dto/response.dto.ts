import { Users } from '../user.entity';

export class UserDto {
  readonly _id: string;
  readonly full_name: string;
  readonly email: string;
  readonly mobile_number: string;
  readonly portal: string;
  readonly status: number;
  readonly username: string;

  constructor(user: Users) {
    (this._id = user._id),
      ((this.full_name = user.full_name),
      (this.email = user.email),
      (this.portal = user.portal),
      (this.status = user.status),
      (this.mobile_number = user.mobile_number),
      (this.username = user.username));
  }
}

export class SingleUserDto {
  readonly _id: string;
  readonly full_name: string;
  readonly email: string;
  readonly portal: string;
  readonly status: number;
  readonly username: string;
  readonly address: string;
  readonly auth_key: string;
  readonly isSuperUser: number;
  readonly mobile_number: string;
  readonly password_hash: string;
  readonly city: string;
  readonly contact_numbers: string;
  readonly created_at: number;

  constructor(user: SingleUserDto) {
    (this._id = user._id),
      ((this.full_name = user.full_name),
      (this.email = user.email),
      (this.portal = user.portal),
      (this.status = user.status),
      (this.username = user.username),
      (this.address = user.address),
      (this.auth_key = user.auth_key),
      (this.isSuperUser = user.isSuperUser),
      (this.mobile_number = user.mobile_number),
      (this.password_hash = user.password_hash),
      (this.city = user.city),
      (this.contact_numbers = user.contact_numbers),
      (this.created_at = user.created_at));
  }
}
