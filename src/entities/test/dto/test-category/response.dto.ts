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
