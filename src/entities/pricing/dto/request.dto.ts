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
  @IsNotEmpty()
  plan_for: string;

  @IsString()
  @IsNotEmpty()
  plan_type: string;

  @IsNumber()
  @IsNotEmpty()
  unit_price: number;

  @IsOptional()
  discount: number;

  @IsNotEmpty()
  packages: any;

  @IsOptional()
  is_published: boolean;
}
