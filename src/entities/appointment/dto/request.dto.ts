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

export class AddAppointmentRequestDto {
  @IsString()
  @IsOptional()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsString()
  @IsNotEmpty()
  age_unit: string;

  @IsString()
  @IsNotEmpty()
  dob: string;

  @IsNumber()
  @IsNotEmpty()
  due_amount: number;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  paid_amount: number;

  @IsNumber()
  @IsNotEmpty()
  total_amount: number;

  @IsNumber()
  @IsOptional()
  discount_amount: number;

  @IsNumber()
  @IsNotEmpty()
  sample_location: number;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  guardian_mobile_number: string;

  @IsString()
  @IsOptional()
  guardian_name: string;

  @IsString()
  @IsOptional()
  guardian_type: string;

  @IsString()
  @IsOptional()
  reference_id: string;

  @IsString()
  @IsOptional()
  reference_number: string;

  @IsOptional()
  remarks: any;

  @IsOptional()
  invoiceLineItems: any;
}

export class AddTestDto {
  @IsString()
  @IsNotEmpty()
  appointment_id: string;

  @IsNumber()
  @IsNotEmpty()
  discount_amount: number;

  @IsNumber()
  @IsNotEmpty()
  due_amount: number;

  @IsNumber()
  @IsOptional()
  total_payable_amount: number;

  @IsNotEmpty()
  invoiceLineItems: any;

  @IsString()
  @IsNotEmpty()
  invoice_id: string;

  @IsNumber()
  @IsNotEmpty()
  paid_amount: number;

  @IsNumber()
  @IsNotEmpty()
  total_amount: number;
}

export class DeleteTestDto {
  @IsString()
  @IsNotEmpty()
  delete_reason: string;

  @IsString()
  @IsNotEmpty()
  invoice_line_item_id: string;

  @IsString()
  @IsNotEmpty()
  invoice_id: string;

  @IsString()
  @IsNotEmpty()
  patient_test_id: string;

  @IsString()
  @IsOptional()
  user_comment: string;
}
