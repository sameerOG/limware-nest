import { UserDto } from 'src/entities/user/dto/response.dto';

export class UserRoleDto {
  readonly _id: string;
  readonly user: UserDto | Object;

  constructor(role: UserRoleDto) {
    (this._id = role._id), (this.user = role.user);
  }
}
