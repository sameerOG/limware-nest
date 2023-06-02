import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class DepartmentRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  facility_id: string;

  @IsString()
  @IsOptional()
  parent: string;

  @IsString()
  @IsOptional()
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

export class findAllDepartmentsResponseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  _id: string;
}
