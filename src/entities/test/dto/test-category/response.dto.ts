import { specimen } from 'src/entities/specimen/specimen.entity';
import { UOM } from 'src/entities/uom/uom.entity';
import { TestCategory } from '../../test_category.entity';

export class TestCategoryDto {
  readonly _id: string;
  readonly name: string;
  readonly title_for_print: string;
  readonly description: string;

  constructor(testCategory: TestCategoryDto) {
    (this._id = testCategory._id),
      (this.name = testCategory.name),
      (this.title_for_print = testCategory.title_for_print),
      (this.description = testCategory.description);
  }
}

export class SingleTestCategory {
  readonly _id: string;
  readonly name: string;
  readonly title_for_print: string;
  readonly description: string;
  readonly is_template: boolean;
  readonly ref_code: string;
  readonly type: string;
  readonly report_template: number;
  readonly updated_by: string;
  readonly updated_at: number;
  readonly created_at: number;
  readonly tests?: Test | Object;

  constructor(testCategory: SingleTestCategory) {
    (this._id = testCategory._id),
      (this.name = testCategory.name),
      (this.title_for_print = testCategory.title_for_print),
      (this.ref_code = testCategory.ref_code),
      (this.type = testCategory.type),
      (this.report_template = testCategory.report_template),
      (this.updated_by = testCategory.updated_by),
      (this.updated_at = testCategory.updated_at),
      (this.created_at = testCategory.created_at),
      (this.is_template = testCategory.is_template),
      (this.tests = testCategory.tests),
      (this.description = testCategory.description);
  }
}

export class Test {
  readonly _id: string;
  readonly name: string;
  readonly title_for_print: string;
  readonly single_or_group: string;
  readonly tags: string;
  readonly sequence: number;
  readonly code: number;
  readonly status: number;
  readonly parametric_only: boolean;
  readonly archived: boolean;

  constructor(test: Test) {
    (this._id = test._id),
      (this.name = test.name),
      (this.title_for_print = test.title_for_print),
      (this.tags = test.tags),
      (this.sequence = test.sequence),
      (this.status = test.status),
      (this.parametric_only = test.parametric_only),
      (this.archived = test.archived),
      (this.code = test.code),
      (this.single_or_group = test.single_or_group);
  }
}

export class ReportTemplate {
  readonly code: number;
  readonly name: string;
  readonly description: string;

  constructor(reportTemplate: ReportTemplate) {
    (this.name = reportTemplate.name),
      (this.code = reportTemplate.code),
      (this.description = reportTemplate.description);
  }
}

export class TestResponseDto {
  readonly _id: string;
  readonly name: string;
  readonly title_for_print: string;
  readonly single_or_group: string;
  readonly tags: string;
  readonly code: number;

  constructor(test: TestResponseDto) {
    (this._id = test._id),
      (this.name = test.name),
      (this.single_or_group = test.single_or_group),
      (this.tags = test.tags),
      (this.code = test.code),
      (this.title_for_print = test.title_for_print);
  }
}

export class SingleTestResponseDto {
  readonly _id: string;
  readonly name: string;
  readonly title_for_print: string;
  readonly single_or_group: string;
  readonly tags: string;
  readonly code: number;
  readonly ref_code: string;
  readonly res_input_type: string;
  readonly is_template: boolean;
  readonly test_category_id: string;
  readonly sequence: number;
  readonly specimen_id: string;
  readonly status: number;
  readonly print_on_separate_page: boolean;
  readonly parametric_only: boolean;
  readonly archived: boolean;
  readonly created_at: number;
  readonly updated_at: number;
  readonly updated_by: string;
  readonly category: TestCategory;
  readonly specimen?: specimen;
  readonly uom: UOM;
  readonly uom_id?: string;
  readonly activeNormalRanges: any;
  readonly parentTestsActive: any;
  readonly sample_quantity: any;
  readonly duration: any;
  readonly report_template_name: any;
  readonly report_template: number;
  readonly default_notes: string;
  readonly description: string;
  readonly rest_input_options: RestInputOptions[];

  constructor(test: SingleTestResponseDto) {
    (this._id = test._id),
      (this.name = test.name),
      (this.single_or_group = test.single_or_group),
      (this.tags = test.tags),
      (this.code = test.code),
      (this.ref_code = test.ref_code),
      (this.res_input_type = test.res_input_type),
      (this.is_template = test.is_template),
      (this.test_category_id = test.test_category_id),
      (this.report_template_name = test.report_template_name),
      (this.report_template = test.report_template),
      (this.sequence = test.sequence),
      (this.specimen_id = test.specimen_id),
      (this.status = test.status),
      (this.print_on_separate_page = test.print_on_separate_page),
      (this.parametric_only = test.parametric_only),
      (this.archived = test.archived),
      (this.created_at = test.created_at),
      (this.updated_at = test.updated_at),
      (this.updated_by = test.updated_by),
      (this.category = test.category),
      (this.specimen = test.specimen),
      (this.sample_quantity = test.sample_quantity),
      (this.duration = test.duration),
      (this.uom = test.uom),
      (this.uom_id = test.uom_id),
      (this.parentTestsActive = test.parentTestsActive),
      (this.rest_input_options = test.rest_input_options),
      (this.default_notes = test.default_notes),
      (this.description = test.description),
      (this.activeNormalRanges = test.activeNormalRanges),
      (this.title_for_print = test.title_for_print);
  }
}

export class Specimen {
  readonly _id: string;
  readonly name: string;
  readonly created_at: number;

  constructor(test: Specimen) {
    (this._id = test._id),
      (this.created_at = test.created_at),
      (this.name = test.name);
  }
}

export class RestInputOptions {
  readonly res_input_option: string;
  readonly is_abnormal?: boolean;

  constructor(test: RestInputOptions) {
    (this.res_input_option = test.res_input_option),
      (this.is_abnormal = test.is_abnormal);
  }
}

export class TestNormalRangeResponse {
  readonly _id: string;
  readonly archived: boolean;
  readonly condition:string
  readonly max_op:string;
  readonly max_value:number;
  readonly min_op:string;
  readonly min_value:number;
  readonly normal_range_for:string;
  readonly sequence:number;
  readonly test_id:string;
  readonly updated_at:number;
  readonly updated_by:string
  readonly created_at: number;

  constructor(test: TestNormalRangeResponse) {
    (this._id = test._id),
      (this.created_at = test.created_at),
      (this.condition = test.condition),
      (this.max_op = test.max_op),
      (this.max_value = test.max_value),
      (this.min_op = test.min_op),
      (this.min_value = test.min_value),
      (this.normal_range_for = test.normal_range_for),
      (this.sequence = test.sequence),
      (this.test_id = test.test_id),
      (this.updated_at = test.updated_at),
      (this.updated_by = test.updated_by),
      (this.archived = test.archived);
  }
}
