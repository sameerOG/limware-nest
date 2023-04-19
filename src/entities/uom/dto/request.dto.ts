import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UomRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: number;
}
