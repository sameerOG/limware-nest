import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePatientRequestDto {
  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsNotEmpty()
  age_unit: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsNotEmpty()
  dob: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  reference_number: string;
}

export class UpdatePatientTestStatusRequestDto {
  @IsNumber()
  @IsNotEmpty()
  sample_status: number;
}

export class MarkAsDoneRequestDto {
  @IsString()
  @IsNotEmpty()
  patient_id: string;

  @IsNotEmpty()
  patient_test_ids: string[];
}
