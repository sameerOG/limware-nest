import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CustomerRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  status: number;

  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
