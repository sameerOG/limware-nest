import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CustomerRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  status: number;

  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
