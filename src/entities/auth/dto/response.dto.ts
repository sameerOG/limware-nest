export class AuthDto {
  readonly email: string;
  readonly full_name: string;
  readonly is_super_user: boolean;
  readonly permissions: any;
  readonly portal: string;
  readonly status: boolean;
  readonly token: string;
  readonly user_id: any;
  readonly username: string;
  readonly facilities?: Facilities[];

  constructor(auth: AuthDto) {
    (this.email = auth.email),
      (this.full_name = auth.full_name),
      (this.is_super_user = auth.is_super_user),
      (this.permissions = auth.permissions),
      (this.portal = auth.portal),
      (this.status = auth.status),
      (this.token = auth.token),
      (this.user_id = auth.user_id),
      (this.facilities = auth.facilities),
      (this.username = auth.username);
  }
}

export class AuthRegisterDto {
  readonly errors: boolean;
  readonly user_id: string;
  readonly full_name: string;
  readonly otpCode: string | number;

  constructor(auth: AuthRegisterDto) {
    (this.errors = auth.errors),
      (this.full_name = auth.full_name),
      (this.otpCode = auth.otpCode),
      (this.user_id = auth.user_id);
  }
}

export class UserVeifiedResponse {
  readonly full_name: string;
  readonly user_verified: boolean;

  constructor(auth: UserVeifiedResponse) {
    (this.full_name = auth.full_name),
      (this.user_verified = auth.user_verified);
  }
}

export class GenerateVerificationPinResponse {
  readonly address: string;
  readonly auth_key: string;
  readonly city: string;
  readonly created_at: number;
  readonly customer_id: string;
  readonly facility_id: string;
  readonly full_name: string;
  readonly mobile_number: string;
  readonly otp: number | string;
  readonly portal: string;
  readonly status: number;
  readonly updated_at: number;
  readonly username: string;
  readonly _id: string;

  constructor(auth: GenerateVerificationPinResponse) {
    (this.address = auth.address),
      (this.auth_key = auth.auth_key),
      (this.city = auth.city),
      (this.created_at = auth.created_at),
      (this.customer_id = auth.customer_id),
      (this.facility_id = auth.facility_id),
      (this.full_name = auth.full_name),
      (this.mobile_number = auth.mobile_number),
      (this.otp = auth.otp),
      (this.portal = auth.portal),
      (this.status = auth.status),
      (this.updated_at = auth.updated_at),
      (this.username = auth.username),
      (this._id = auth._id);
  }
}

export class Facilities {
  readonly name: string;
  readonly permissions: any;
  readonly type: string;
  readonly unique_id: string;
  readonly _id: Object;

  constructor(auth: Facilities) {
    (this.name = auth.name),
      (this.permissions = auth.permissions),
      (this.unique_id = auth.unique_id),
      (this._id = auth._id),
      (this.type = auth.type);
  }
}

export class ProfileResponse {
  readonly address: string;
  readonly city: string;
  readonly created_at: number;
  readonly email: string;
  readonly _id: string;
  readonly full_name: string;
  readonly mobile_number: string;
  readonly password_hash: string;
  readonly status: number;
  readonly updated_at: number;
  readonly updated_by: string;
  readonly username: string;
  readonly contact_numbers: any;
  readonly profile_image_name?: string;

  constructor(auth: ProfileResponse) {
    (this.address = auth.address),
      (this.city = auth.city),
      (this.created_at = auth.created_at),
      (this._id = auth._id),
      (this.full_name = auth.full_name),
      (this.mobile_number = auth.mobile_number),
      (this.password_hash = auth.password_hash),
      (this.status = auth.status),
      (this.updated_at = auth.updated_at),
      (this.updated_by = auth.updated_by),
      (this.username = auth.username),
      (this.contact_numbers = auth.contact_numbers),
      (this.profile_image_name = auth.profile_image_name),
      (this.email = auth.email);
  }
}
