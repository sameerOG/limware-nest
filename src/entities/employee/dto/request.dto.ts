import { IsString, IsNotEmpty, IsNumber, IsEmail } from 'class-validator';

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

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @IsNumber()
  @IsNotEmpty()
  status: number;
}
