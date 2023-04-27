import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class TestCategoryRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  is_template: boolean;

  @IsString()
  @IsNotEmpty()
  title_for_print: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  report_template: number;
}

export class TestRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  test_category_id: string;

  @IsString()
  @IsNotEmpty()
  title_for_print: string;

  @IsOptional()
  specimen_id: any;

  @IsOptional()
  uom_id: string;

  @IsBoolean()
  @IsOptional()
  print_on_separate_page: boolean;

  @IsObject()
  @IsOptional()
  duration: Object;

  @IsObject()
  @IsOptional()
  sample_quantity: Object;

  // Optional Parameters
  @IsNumber()
  @IsOptional()
  decimal_length: number;

  @IsString()
  @IsOptional()
  default_notes: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  is_template: boolean;

  @IsOptional()
  normal_ranges: any;

  @IsOptional()
  report_template: number | null;

  @IsOptional()
  res_input_options: any;

  @IsString()
  @IsOptional()
  res_input_type: string;

  @IsString()
  @IsOptional()
  single_or_group: string;

  @IsBoolean()
  @IsOptional()
  parametric_only: boolean;

  @IsString()
  @IsOptional()
  parent_test_id: string;

  @IsString()
  @IsOptional()
  department_id: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  daily_notes: string;
}

export class TestNormalRangeRequest {
  @IsString()
  @IsOptional()
  test_id: string;

  @IsString()
  @IsNotEmpty()
  normal_range_for: string;

  @IsString()
  @IsOptional()
  condition: string;

  @IsString()
  @IsOptional()
  min_op: string;

  @IsString()
  @IsOptional()
  max_op: string;

  @IsOptional()
  min_value: number;

  @IsOptional()
  max_value: number;
}
