import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEmail,
  IsArray,
  IsOptional,
} from 'class-validator';

export class EmployeeRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  customer_id: any;

  @IsNotEmpty()
  facility_id: any;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  cnic: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @IsNumber()
  @IsNotEmpty()
  status: number;
}

export class AssignFacilityRequestDto {
  @IsOptional()
  departments: string[];

  @IsString()
  @IsNotEmpty()
  employee_id: string;

  @IsString()
  @IsNotEmpty()
  facility_id: any;

  @IsNotEmpty()
  role_ids: any;

  @IsOptional()
  id: string;

  @IsOptional()
  _id: string;
}
