import {
  IsArray,
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

  @IsOptional()
  is_template: boolean;

  @IsString()
  @IsNotEmpty()
  title_for_print: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  facility_id: string;

  @IsString()
  @IsOptional()
  laboratory_id: string;

  @IsString()
  @IsOptional()
  department_id: string;

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

  @IsOptional()
  duration: any;

  @IsOptional()
  sample_quantity: any;

  // Optional Parameters
  @IsOptional()
  decimal_length: number;

  @IsString()
  @IsOptional()
  default_notes: string;

  @IsString()
  @IsOptional()
  description: string;

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

  @IsOptional()
  parametric_only: boolean;

  @IsString()
  @IsOptional()
  parent_test_id: string;

  @IsString()
  @IsOptional()
  department_id: string;

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

export class MultiplePayload {
  @IsString()
  @IsNotEmpty()
  parent_test_id: string;

  @IsString()
  @IsOptional()
  test_group_id: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  child_test_ids: string;
}

export class UpdateTestParameterRequestDto {
  @IsString()
  @IsNotEmpty()
  parent_test_id: string;

  @IsString()
  @IsOptional()
  test_group_id: string;

  @IsString()
  @IsOptional()
  test_group_name: string;

  @IsString()
  @IsNotEmpty()
  child_test_id: string;
}

export class TestParameterRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  title_for_print: string;

  @IsString()
  @IsOptional()
  uom_id: string;

  @IsString()
  @IsOptional()
  test_group_name: string;

  @IsString()
  @IsOptional()
  test_group_id: string;

  @IsString()
  @IsOptional()
  res_input_type: string;

  @IsOptional()
  res_input_options: any;

  @IsString()
  @IsOptional()
  decimal_length: string;

  @IsString()
  @IsOptional()
  parent_test_id: string;

  @IsOptional()
  normal_ranges: any;
}
