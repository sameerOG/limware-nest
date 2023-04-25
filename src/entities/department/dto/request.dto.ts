import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class DepartmentRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  facility_id: string;

  @IsString()
  @IsNotEmpty()
  parent: string;

  @IsString()
  @IsNotEmpty()
  parent_id: string;
}

export class EditDepartmentRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
