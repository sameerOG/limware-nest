import { IsNotEmpty, IsString } from 'class-validator';

export class ReportRequestDto {
  @IsNotEmpty()
  start_date: any;

  @IsNotEmpty()
  end_date: any;
}
