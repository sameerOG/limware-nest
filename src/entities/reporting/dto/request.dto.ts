import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ReportRequestDto {
  @IsOptional()
  start_date: any;

  @IsOptional()
  end_date: any;

  @IsOptional()
  date: any;
}
