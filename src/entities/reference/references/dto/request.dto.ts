import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ReferenceRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  city: number;

  @IsString()
  @IsOptional()
  address: number;
}
