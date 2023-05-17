import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FeatureRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  is_published: boolean;
}
