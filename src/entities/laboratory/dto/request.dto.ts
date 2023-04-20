import { IsString, IsNotEmpty, IsNumber, IsObject } from 'class-validator';

export class LaboratoryRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  customer_id: any;

  @IsNotEmpty()
  facility_id: any;

  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @IsNumber()
  @IsNotEmpty()
  status: number;
}
