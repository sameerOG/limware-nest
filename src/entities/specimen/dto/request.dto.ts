import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SpecimenRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
