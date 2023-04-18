import { Role } from '../role.entity';

export class RoleDto {
  readonly _id: string;
  readonly name: string;
  readonly portal: string;
  readonly status: number;

  constructor(user: Role) {
    (this._id = user._id),
      ((this.name = user.name),
      (this.portal = user.portal),
      (this.status = user.status));
  }
}

export class SingleRoleDto {
  readonly _id: string;
  readonly updated_by: string;
  readonly system_role: boolean;
  readonly status: number;
  readonly portal: string;
  readonly permissions: string;
  readonly name: string;
  readonly key: string;
  readonly created_at: number;
  readonly updated_at: number;

  constructor(role: SingleRoleDto) {
    (this._id = role._id),
      ((this.updated_by = role.updated_by),
      (this.system_role = role.system_role),
      (this.portal = role.portal),
      (this.permissions = role.permissions),
      (this.name = role.name),
      (this.key = role.key),
      (this.created_at = role.created_at),
      (this.updated_at = role.updated_at),
      (this.status = role.status));
  }
}
