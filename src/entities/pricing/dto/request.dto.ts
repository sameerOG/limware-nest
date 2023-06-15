import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class PricingPlanRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  plan_for: string;

  @IsOptional()
  trial_days: number;

  @IsString()
  @IsNotEmpty()
  plan_type: string;

  @IsNumber()
  @IsNotEmpty()
  unit_price: number;

  @IsOptional()
  discount: number;

  @IsOptional()
  packages: any;

  @IsOptional()
  is_published: boolean;
}
