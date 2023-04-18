import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class UserRoleRequestDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  role_id: string;
}

export class UserRoleResponseDto {
  readonly _id: string;
  readonly user_id: string;
  readonly role_id: string;
  readonly created_at: number;
  readonly updated_at: number;
  readonly updated_by: string;
  readonly created_by: string;

  constructor(user_role: UserRoleResponseDto) {
    (this._id = user_role._id),
      (this.user_id = user_role.user_id),
      (this.role_id = user_role.role_id),
      (this.created_at = user_role.created_at),
      (this.updated_at = user_role.updated_at),
      (this.updated_by = user_role.updated_by),
      (this.created_by = user_role.created_by);
  }
}
