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

  constructor(auth: AuthRegisterDto) {
    (this.errors = auth.errors),
      (this.full_name = auth.full_name),
      (this.user_id = auth.user_id);
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
