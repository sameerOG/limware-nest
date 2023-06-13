import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator';

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

  @IsOptional()
  address: string;

  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @IsNumber()
  @IsNotEmpty()
  status: number;
}
