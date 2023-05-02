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
  readonly condition: string;
  readonly max_op: string;
  readonly max_value: number;
  readonly min_op: string;
  readonly min_value: number;
  readonly normal_range_for: string;
  readonly sequence: number;
  readonly test_id: string;
  readonly updated_at: number;
  readonly updated_by: string;
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

export class TestParameterResponse {
  readonly singleTests: singleTests[];
  readonly groups: groups[];

  constructor(testParam: TestParameterResponse) {
    (this.singleTests = testParam.singleTests),
      (this.groups = testParam.groups);
  }
}

export class singleTests {
  readonly _id: string;
  readonly parent_test_id: string;
  readonly child_test_id: string;
  readonly test_group_id: string;
  readonly sequence: number;
  readonly childTestWithDetails: childTestWithDetails;

  constructor(test: singleTests) {
    (this._id = test._id),
      (this.parent_test_id = test.parent_test_id),
      (this.child_test_id = test.child_test_id),
      (this.test_group_id = test.test_group_id),
      (this.childTestWithDetails = test.childTestWithDetails),
      (this.sequence = test.sequence);
  }
}

export class childTestWithDetails {
  readonly _id: string;
  readonly code: number;
  readonly name: string;
  readonly title_for_print: string;
  readonly sequence: number;
  readonly single_or_group: string;
  readonly normal_range: any;
  readonly uom: Uom;

  constructor(test: childTestWithDetails) {
    (this._id = test._id),
      (this.code = test.code),
      (this.name = test.name),
      (this.title_for_print = test.title_for_print),
      (this.single_or_group = test.single_or_group),
      (this.normal_range = test.normal_range),
      (this.uom = test.uom),
      (this.sequence = test.sequence);
  }
}

export class Uom {
  readonly _id: string;
  readonly name: string;
  readonly description: string;
  readonly created_at: number;

  constructor(uom: Uom) {
    (this._id = uom._id),
      (this.name = uom.name),
      (this.description = uom.description),
      (this.created_at = uom.created_at);
  }
}

export class groups {
  readonly _id: string;
  readonly name: string;
  readonly sequence: number;

  constructor(groups: groups) {
    (this._id = groups._id),
      (this.name = groups.name),
      (this.sequence = groups.sequence);
  }
}

export class tests {
  readonly _id: string;
  readonly name: string;
  readonly sequence: number;
  readonly tests: singleTests[];

  constructor(test: tests) {
    (this._id = test._id),
      (this.name = test.name),
      (this.tests = test.tests),
      (this.sequence = test.sequence);
  }
}

export class UnassignedParameters {
  readonly _id: string;
  readonly name: string;
  readonly code: number;

  constructor(unassignedParameter: UnassignedParameters) {
    (this._id = unassignedParameter._id),
      (this.name = unassignedParameter.name),
      (this.code = unassignedParameter.code);
  }
}

export class AllGroups {
  readonly _id: string;
  readonly parent: string;
  readonly parent_id: string;
  readonly name: string;
  readonly archived: boolean;
  readonly sequence: number;
  readonly updated_by: string;
  readonly created_at: number;
  readonly updated_at: number;

  constructor(group: AllGroups) {
    (this._id = group._id),
      (this.parent = group.parent),
      (this.parent_id = group.parent_id),
      (this.name = group.name),
      (this.archived = group.archived),
      (this.sequence = group.sequence),
      (this.updated_by = group.updated_by),
      (this.created_at = group.created_at),
      (this.updated_at = group.updated_at);
  }
}

export class CreateParameterTestResponse {
  readonly archived: boolean;
  readonly created_at: number;
  readonly code: number;
  readonly decimal_length: string;
  readonly default_notes: string;
  readonly description: string;
  readonly duration: any;
  readonly is_template: boolean;
  readonly name: string;
  readonly parametric_only: boolean;
  readonly print_on_separate_page: boolean;
  readonly report_template: number;
  readonly res_input_options: any;
  readonly res_input_type: string;
  readonly sample_quantity: string;
  readonly sequence: number;
  readonly single_or_group: string;
  readonly specimen_id: string;
  readonly status: number;
  readonly tags: string;
  readonly test_category_id: string;
  readonly title_for_print: string;
  readonly uom_id: string;
  readonly updated_at: number;
  readonly updated_by: string;
  readonly _id: string;

  constructor(paramTest: CreateParameterTestResponse) {
    (this.archived = paramTest.archived),
      (this.created_at = paramTest.created_at),
      (this.code = paramTest.code),
      (this.decimal_length = paramTest.decimal_length),
      (this.duration = paramTest.duration),
      (this.default_notes = paramTest.default_notes),
      (this.description = paramTest.description),
      (this.is_template = paramTest.is_template),
      (this.name = paramTest.name),
      (this.parametric_only = paramTest.parametric_only),
      (this.print_on_separate_page = paramTest.print_on_separate_page),
      (this.report_template = paramTest.report_template),
      (this.res_input_options = paramTest.res_input_options),
      (this.res_input_type = paramTest.res_input_type),
      (this.sample_quantity = paramTest.sample_quantity),
      (this.sequence = paramTest.sequence),
      (this.single_or_group = paramTest.single_or_group),
      (this.specimen_id = paramTest.specimen_id),
      (this.status = paramTest.status),
      (this.tags = paramTest.tags),
      (this.test_category_id = paramTest.test_category_id),
      (this.title_for_print = paramTest.title_for_print),
      (this.uom_id = paramTest.uom_id),
      (this.updated_at = paramTest.updated_at),
      (this.updated_by = paramTest.updated_by),
      (this._id = paramTest._id);
  }
}

export class SingleParameterTestResponse {
  readonly archived: boolean;
  readonly child_test_id: string;
  readonly created_at: number;
  readonly parent_test_id: string;
  readonly sequence: number;
  readonly updated_at: number;
  readonly updated_by: string;
  readonly _id: string;
  readonly childTest: any;

  constructor(unassignedParameter: SingleParameterTestResponse) {
    (this.archived = unassignedParameter.archived),
      (this.child_test_id = unassignedParameter.child_test_id),
      (this.created_at = unassignedParameter.created_at),
      (this.parent_test_id = unassignedParameter.parent_test_id),
      (this.sequence = unassignedParameter.sequence),
      (this.updated_at = unassignedParameter.updated_at),
      (this._id = unassignedParameter._id),
      (this.updated_by = unassignedParameter.updated_by),
      (this.childTest = unassignedParameter.childTest);
  }
}
