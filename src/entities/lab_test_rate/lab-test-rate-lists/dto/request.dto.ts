import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class LabTestRateListRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  status: number;

  @IsNotEmpty()
  items: string;
}
