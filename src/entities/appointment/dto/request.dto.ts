import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';

export class SearchPatientRequest {
  @IsString()
  @IsNotEmpty()
  mobile_number: string;
}

export class AddAppointment {
  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @IsString()
  @IsOptional()
  reference_number: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsString()
  @IsNotEmpty()
  age_unit: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsOptional()
  dob: string;

  @IsString()
  @IsOptional()
  remarks: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  guardian_type: string;

  @IsString()
  @IsOptional()
  guardian_name: string;

  @IsString()
  @IsOptional()
  guardian_mobile_number: string;

  @IsOptional()
  sample_location: number;

  @IsString()
  @IsOptional()
  total_amount: string;

  @IsOptional()
  discount_amount: number;

  @IsString()
  @IsOptional()
  due_amount: string;

  @IsOptional()
  paid_amount: number;

  @IsArray()
  @IsOptional()
  invoiceLineItems: any;

  @IsString()
  @IsOptional()
  reference_id: string;
}
