import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class RoleRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  portal: string;

  @IsNumber()
  @IsNotEmpty()
  status: number;
}

export class AssignPermissionRequest {
  @IsString()
  @IsNotEmpty()
  role_id: string;

  @IsNotEmpty()
  permissions: any;
}
