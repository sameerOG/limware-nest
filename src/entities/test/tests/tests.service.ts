import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transformSortField } from 'src/common/utils/transform-sorting';
import { EmployeeFacilityDepartment } from 'src/entities/employee/employee_facility_department.entity';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { LabTestRateList } from 'src/entities/lab_test_rate/lab_test_rate_list.entity';
import { LabTestRateListItem } from 'src/entities/lab_test_rate/lab_test_rate_list_item.entity';
import { PatientTest } from 'src/entities/patient/patient_test.entity';
import { PatientTestParameterResult } from 'src/entities/patient/patient_test_parameter_result.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import {
  TestNormalRangeRequest,
  TestRequestDto,
} from '../dto/test-category/request.dto';
import {
  SingleTestResponseDto,
  Specimen,
  TestNormalRangeResponse,
  TestResponseDto,
} from '../dto/test-category/response.dto';
import { Test } from '../test.entity';
import { TestCategory } from '../test_category.entity';
import { TestGroup } from '../test_group.entity';
import { TestNormalRange } from '../test_normal_range.entity';
import { TestParameter } from '../test_parameter.entity';
import { isEmpty } from 'lodash';
@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(Test) private testRep: Repository<Test>,
    @InjectRepository(TestCategory)
    private testCategoryRep: Repository<TestCategory>,
    @InjectRepository(Laboratory)
    private labRep: Repository<Laboratory>,
    @InjectRepository(LabTestRateList)
    private labTestRateRep: Repository<LabTestRateList>,
    @InjectRepository(LabTestRateListItem)
    private labTestRateItemRep: Repository<LabTestRateListItem>,
    @InjectRepository(Specimen)
    private specimenRep: Repository<Specimen>,
    @InjectRepository(TestGroup)
    private testGroupRep: Repository<TestGroup>,
    @InjectRepository(TestNormalRange)
    private testNormalRangeRep: Repository<TestNormalRange>,
    @InjectRepository(PatientTest)
    private patientTestRep: Repository<PatientTest>,
    @InjectRepository(TestParameter)
    private testParameterRep: Repository<TestParameter>,
    @InjectRepository(PatientTestParameterResult)
    private patientTestParameterResultRep: Repository<PatientTestParameterResult>,
  ) {}

  async getAll(
    user,
    skip: number,
    take: number,
    text?: string,
    sort?: string,
  ): Promise<TestResponseDto[]> {
    let where: any = {
      archived: false,
    };

    if (text) {
      where = {
        ...where,
        or: [
          { name: Like(`%${text}%`) },
          { title_for_print: Like(`%${text}%`) },
          { single_or_group: Like(`%${text}%`) },
          { tags: Like(`%${text}%`) },
        ],
      };
    }
    const data: any = await this.testRep.find({
      select: [
        '_id',
        'name',
        'single_or_group',
        'title_for_print',
        'tags',
        'code',
        'facility_id',
        'is_template',
      ],
      where,
      skip,
      take,
      order: transformSortField(sort),
    });
    let filteredTest;
    if (user.portal === 'limware') {
      filteredTest = data.filter((info) => {
        return (
          info.facility_id === user.facility_id || info.is_template === true
        );
      });
    } else {
      filteredTest = data;
    }
    return filteredTest;
  }

  async getSingle(id: string): Promise<SingleTestResponseDto> {
    try {
      const data = await this.testRep.findOne({
        select: [
          '_id',
          'name',
          'ref_code',
          'title_for_print',
          'single_or_group',
          'res_input_type',
          'tags',
          'is_template',
          'res_input_options',
          'sequence',
          'code',
          'status',
          'parametric_only',
          'archived',
          'created_at',
          'updated_at',
          'report_template_name',
          'sample_quantity',
          'duration',
          'report_template',
          'default_notes',
          'description',
        ],
        relations: [
          'specimen_id',
          'test_category_id',
          'uom_id',
          'test_normal_range',
        ],
        where: { _id: id },
      });

      const parentTests = await this.testParameterRep
        .createQueryBuilder('test_parameter')
        .select('test_parameter._id,test_parameter.parent_test_id')
        .where('test_parameter.child_test_id = :child_test_id', {
          child_test_id: id,
        })
        .where('test_parameter.archived = :archived', {
          archived: false,
        })
        .getRawMany();

      let parentTestsActive = [];

      for (let i = 0; i < parentTests.length; i++) {
        const test = await this.testRep.findOne({
          where: { _id: parentTests[i].parent_test_id },
        });
        let obj = {
          test_parameter_id: parentTests[i]._id,
          parentTest: test,
        };
        parentTestsActive.push(obj);
      }

      const { ...rest } = data;
      return new SingleTestResponseDto({
        ...rest,
        created_at: data.created_at.getTime(),
        updated_at: data.updated_at.getTime(),
        updated_by: '',
        print_on_separate_page: data.report_template ? true : false,
        specimen: data.specimen_id,
        uom: data.uom_id,
        category: data.test_category_id,
        parentTestsActive,
        rest_input_options: [],
        test_category_id: data.test_category_id?._id,
        specimen_id: data.specimen_id?._id,
        uom_id: data.uom_id?._id,
        activeNormalRanges: data.test_normal_range,
      });
    } catch (err) {
      return err;
    }
  }

  async update(
    id: string,
    data: TestRequestDto,
  ): Promise<SingleTestResponseDto> {
    try {
      const body: any = { ...data };
      if (body.report_template) {
        const reportTemplates = [
          {
            code: 1,
            description:
              '2 Column layout with test name, result, normal range and uom',
            name: 'Template 1',
          },
          {
            code: 2,
            description:
              '3 Column layout with test name, result and normal range',
            name: 'Template 2',
          },
          {
            code: 3,
            description: '2 Column layout with test name and result',
            name: 'Template 3',
          },
          {
            code: 4,
            description:
              'Auto left aligned test parameters which contain test name, result and uom',
            name: 'Template 4',
          },
          {
            code: 5,
            description:
              'Cross match report template to show donor information as well.',
            name: 'Cross Match',
          },
          {
            code: 5,
            description: 'Widal report template.',
            name: 'Widal',
          },
        ];

        const reportTemplateName = reportTemplates.find((temp) => {
          return temp.code === body.report_template;
        });
        body.report_template_name = reportTemplateName.name;
      }
      if (!body.print_on_separate_page) {
        body.report_template = null;
        body.report_template_name = null;
      }
      delete body.print_on_separate_page;
      await this.testRep.update(id, body);
      const savedData = await this.testRep.findOne({
        select: [
          '_id',
          'name',
          'ref_code',
          'title_for_print',
          'single_or_group',
          'res_input_type',
          'tags',
          'is_template',
          'res_input_options',
          'sequence',
          'code',
          'status',
          'parametric_only',
          'archived',
          'created_at',
          'report_template_name',
          'sample_quantity',
          'duration',
          'report_template',
          'default_notes',
          'description',
        ],
        relations: [
          'specimen_id',
          'test_category_id',
          'uom_id',
          'test_normal_range',
        ],
        where: { _id: id },
      });
      const { ...rest } = savedData;
      return new SingleTestResponseDto({
        ...rest,
        created_at: savedData.created_at.getTime(),
        updated_at: savedData.updated_at.getTime(),
        updated_by: '',
        print_on_separate_page: savedData.report_template ? true : false,
        specimen: savedData.specimen_id,
        uom: savedData.uom_id,
        category: savedData.test_category_id,
        parentTestsActive: [],
        rest_input_options: [],
        test_category_id: savedData.test_category_id?._id,
        specimen_id: savedData.specimen_id?._id,
        uom_id: savedData.uom_id?._id,
        activeNormalRanges: savedData.test_normal_range,
      });
    } catch (err) {
      return err;
    }
  }

  async add(data: TestRequestDto, user): Promise<SingleTestResponseDto> {
    try {
      const body: any = { ...data };
      if (body.report_template) {
        const reportTemplates = [
          {
            code: 1,
            description:
              '2 Column layout with test name, result, normal range and uom',
            name: 'Template 1',
          },
          {
            code: 2,
            description:
              '3 Column layout with test name, result and normal range',
            name: 'Template 2',
          },
          {
            code: 3,
            description: '2 Column layout with test name and result',
            name: 'Template 3',
          },
          {
            code: 4,
            description:
              'Auto left aligned test parameters which contain test name, result and uom',
            name: 'Template 4',
          },
          {
            code: 5,
            description:
              'Cross match report template to show donor information as well.',
            name: 'Cross Match',
          },
          {
            code: 5,
            description: 'Widal report template.',
            name: 'Widal',
          },
        ];

        const reportTemplateName = reportTemplates.find((temp) => {
          temp.code === body.report_template;
        });
        body.report_template_name = reportTemplateName;
      }
      const test =
        body.single_or_group === 'single'
          ? await this.createSingleTest(body, user)
          : await this.createGroupTest(body, user);
      const savedData = await this.testRep.findOne({
        select: [
          '_id',
          'name',
          'ref_code',
          'title_for_print',
          'single_or_group',
          'res_input_type',
          'tags',
          'is_template',
          'res_input_options',
          'sequence',
          'code',
          'status',
          'parametric_only',
          'archived',
          'created_at',
          'report_template_name',
          'sample_quantity',
          'duration',
          'report_template',
          'default_notes',
          'description',
          'created_at',
          'updated_at',
        ],
        relations: [
          'specimen_id',
          'test_category_id',
          'uom_id',
          'test_normal_range',
        ],
        where: { _id: test._id },
      });
      const { ...rest } = savedData;
      return new SingleTestResponseDto({
        ...rest,
        created_at: savedData.created_at?.getTime(),
        updated_at: savedData.updated_at?.getTime(),
        updated_by: '',
        print_on_separate_page: false,
        specimen: savedData.specimen_id,
        uom: savedData.uom_id,
        category: savedData.test_category_id,
        parentTestsActive: [],
        rest_input_options: [],
        test_category_id: savedData.test_category_id?._id,
        specimen_id: savedData.specimen_id?._id,
        uom_id: savedData.uom_id?._id,
        activeNormalRanges: savedData.test_normal_range,
      });
    } catch (err) {
      console.log('err', err);
      throw new HttpException('TEST_CREATE_FAIL', HttpStatus.BAD_REQUEST);
    }
  }

  async __deleteTestWithNR_and_ThrowError(test_id: string) {
    await this.testNormalRangeRep.delete(<FindOptionsWhere<TestNormalRange>>{
      where: { test_id: test_id },
    });
    await this, this.testRep.delete(test_id);
    throw new HttpException('TEST_CREATE_FAIL', HttpStatus.BAD_REQUEST);
  }

  async createSingleTest(data: TestRequestDto, user: any) {
    let tag = data.name;
    if (data.name != data.title_for_print) {
      tag = data.name + ', ' + data.title_for_print;
    }
    const {
      test_category_id,
      name,
      normal_ranges,
      price,
      title_for_print,
      parent_test_id,
      department_id,
      uom_id,
      parametric_only,
      res_input_options,
      specimen_id,
      decimal_length,
      sample_quantity,
      res_input_type,
      description,
      default_notes,
      duration,
      single_or_group,
      print_on_separate_page,
      report_template,
    } = data;
    const testData: any = {
      test_category_id,
      name,
      title_for_print,
      uom_id,
      specimen_id,
      sample_quantity: sample_quantity || '',
      res_input_type,
      description: description || '',
      default_notes: default_notes || '',
      duration: duration || null,
      single_or_group,
      print_on_separate_page,
      report_template,
      tags: tag,
      status: 1,
      sequence: 1, //check this from php code
    };
    if (res_input_type == 'number_field') {
      Object.assign(testData, { decimal_length });
    }

    if (res_input_options) {
      Object.assign(testData, { res_input_options });
    }

    if (parametric_only) {
      Object.assign(testData, { parametric_only, parent_test_id });
    }
    const lab = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();
    if (user.portal === 'administration') {
      Object.assign(testData, { is_template: true });
    } else if (user.portal === 'limware') {
      Object.assign(testData, {
        facility_id: user.facility_id,
        laboratory_id: lab?._id,
        department_id: department_id,
      });
    }
    const savedTest = await this.testRep.save(testData);
    if (savedTest) {
      if (normal_ranges?.length > 0) {
        //normal ranges logic here
        normal_ranges.forEach(async (range) => {
          if (isEmpty(range.min_value)) {
            delete range.min_value;
          }
          if (isEmpty(range.max_value)) {
            delete range.max_value;
          }
          Object.assign(range, { test_id: savedTest._id });
          const normalRange = await this.testNormalRangeRep.save(range);
          if (!normalRange) {
            await this.__deleteTestWithNR_and_ThrowError(savedTest._id);
          }
        });
      }

      if (user.portal === 'limware') {
        const rateListData = {
          facility_id: user.facility_id,
          laboratory_id: lab._id,
          price: price ? price : 0,
          test_id: savedTest._id,
          name: '',
        };
        await this.savePrice(rateListData);
      }
    }
    return savedTest;
  }

  async createGroupTest(data: TestRequestDto, user: any) {
    let tag = data.name;
    if (data.name != data.title_for_print) {
      tag = data.name + ', ' + data.title_for_print;
    }

    const {
      test_category_id,
      name,
      normal_ranges,
      price,
      title_for_print,
      department_id,
      description,
      default_notes,
      single_or_group,
      print_on_separate_page,
      report_template,
    } = data;
    const testData: any = {
      test_category_id,
      name,
      title_for_print,
      description: description || '',
      default_notes: default_notes || '',
      single_or_group,
      print_on_separate_page,
      report_template,
      tags: tag,
      status: 1,
      sequence: 1, //check this from php code
    };

    if (user.portal === 'administration') {
      Object.assign(testData, { is_template: true });
    } else if (user.portal === 'limware') {
      const lab = await this.labRep
        .createQueryBuilder('laboratory')
        .select('laboratory.*')
        .where('laboratoty.facility_id = :facility_id', {
          facility_id: user.facility_id,
        })
        .getRawOne();
      Object.assign(testData, {
        facility_id: user.facility_id,
        laboratory_id: lab._id,
        department_id: department_id,
      });
    }

    const savedTest = await this.testRep.save(testData);
    if (savedTest) {
      if (normal_ranges?.length > 0) {
        //normal ranges logic here
      }

      await this.checkForCustomTests(
        user,
        savedTest._id,
        data.test_category_id,
      );

      if (user.portal === 'limware') {
        const lab = await this.labRep
          .createQueryBuilder('laboratory')
          .select('laboratory.*')
          .where('laboratoty.facility_id = :facility_id', {
            facility_id: user.facility_id,
          })
          .getRawOne();
        const rateListData = {
          facility_id: user.facility_id,
          laboratory_id: lab._id,
          price: price ? price : 0,
          test_id: savedTest._id,
        };
        await this.savePrice(rateListData);
      }
    }
    return savedTest;
  }

  async checkForCustomTests(user, test_id: string, test_category_id: string) {
    const testCategory = await this.testCategoryRep.findOne({
      select: ['type'],
      where: { _id: test_category_id },
    });

    if (testCategory.type === 'cross match') {
      await this.afterSaveCrossMatchTest(user, test_id);
    } else if (testCategory.type === 'widal') {
      await this.afterSaveWidalTest(test_id);
    }
    return true;
  }

  async afterSaveWidalTest(test_id: string): Promise<void> {
    const specimen = await this.specimenRep.findOne({
      where: { name: 'Blood' },
    });

    if (specimen) {
      const test: any = await this.testRep.findOne({
        where: {
          _id: test_id,
        },
      });

      if (test) {
        test.specimen_id = specimen._id;
        await this.testRep.update(test_id, test);
      }
    }
  }

  async afterSaveCrossMatchTest(user, test_id: string): Promise<void> {
    let labModal = null;

    if (user.portal === 'limware') {
      labModal = await this.labRep
        .createQueryBuilder('laboratory')
        .select('laboratory.*')
        .where('laboratoty.facility_id = :facility_id', {
          facility_id: user.facility_id,
        })
        .getRawOne();
    }

    const groupData = [
      { parent: 'test', parent_id: test_id, name: 'Patient Tests' },
      { parent: 'test', parent_id: test_id, name: 'Donor Tests' },
    ];

    groupData.forEach(async (groupData: any) => {
      if (user.portal === 'limware') {
        Object.assign(groupData, {
          facility_id: user.facility_id,
          laboratory_id: labModal._id,
        });
      }
      await this.testGroupRep.save(groupData);
    });
  }

  async savePrice(data: any) {
    const rateLists = await this.labTestRateRep
      .createQueryBuilder('lab_test_rate_list')
      .select('lab_test_rate_list.*')
      .where('lab_test_rate_list.facility_id = :facility_id', {
        facility_id: data.facility_id,
      })
      .andWhere('lab_test_rate_list.laboratory_id = :laboratory_id', {
        laboratory_id: data.laboratory_id,
      })
      .getRawMany();

    if (rateLists.length > 0) {
      for (let i = 0; i < rateLists.length; i++) {
        Object.assign(data, { lab_test_rate_list_id: rateLists[i]._id });
        await this.labTestRateItemRep.save(data);
      }
    }
  }

  async delete(id: any, user): Promise<any> {
    try {
      const lab = await this.labRep
        .createQueryBuilder('laboratory')
        .select('laboratory.*')
        .where('laboratory.facility_id = :facility_id', {
          facility_id: user.facility_id,
        })
        .getRawOne();
      let savedTest: any = await this.testRep.findOne({
        where: { _id: id },
        relations: [
          'test_normal_range',
          'test_parameter_parent',
          'test_parameter_child',
          'patient_test',
          'ptpr',
          'laboratory_id',
        ],
      });
      let test;
      test = savedTest;
      // if (user.portal === 'limware') {
      //   if (savedTest.facility_id?._id === user.facility_id) {
      //     test = savedTest;
      //   }
      // } else {
      //   test = savedTest;
      // }
      if (test.patient_test.length === 0 && test.ptpr.length === 0) {
        await this.testNormalRangeRep.delete({ test_id: id });
        await this.testRep.delete(test._id);
        return test;
      } else if (test.patient_test.length > 0 || test.ptpr.length > 0) {
        await this._archiveEverything(
          test,
          test.patient_test.length,
          test.ptpr.length,
        );
        const updatedTest = await this.testRep.update(id, { archived: true });
        return updatedTest;
      }
    } catch (err) {
      console.log('err', err);
      return err;
    }
  }

  async _archiveEverything(
    data: Test,
    patientTestsCount: number,
    patientTestsParametersCount: number,
  ) {
    if (patientTestsCount > 0 || patientTestsParametersCount > 0) {
      const normalRanges = data.test_normal_range;
      const testParametersParent = data.test_parameter_parent;
      const testParametersChild = data.test_parameter_child;

      for (let i = 0; i < normalRanges.length; i++) {
        const element = normalRanges[i];
        element.archived = true;
        await this.testNormalRangeRep.update(element._id, element);
      }

      for (let i = 0; i < testParametersParent.length; i++) {
        const element = testParametersParent[i];
        element.archived = true;
        await this.testParameterRep.update(element._id, element);
      }

      for (let i = 0; i < testParametersChild.length; i++) {
        const element = testParametersChild[i];
        element.archived = true;
        await this.testParameterRep.update(element._id, element);
      }
    }
  }

  async getSingleTestNormalRange(id: string): Promise<TestNormalRangeResponse> {
    try {
      const data = await this.testNormalRangeRep.findOne({
        select: [
          '_id',
          'archived',
          'condition',
          'created_at',
          'max_op',
          'max_value',
          'min_op',
          'min_value',
          'normal_range_for',
          'sequence',
          'test_id',
          'updated_at',
        ],
        relations: ['test_id'],
        where: { _id: id },
      });

      const { ...rest } = data;
      return new TestNormalRangeResponse({
        ...rest,
        created_at: data.created_at.getTime(),
        updated_at: data.updated_at.getTime(),
        updated_by: '',
        test_id: data.test_id._id,
      });
    } catch (err) {
      return err;
    }
  }

  async updateTestNormalRange(
    id: string,
    data: TestNormalRangeRequest,
  ): Promise<TestNormalRangeResponse> {
    try {
      const body: any = { ...data };
      body.min_value = body.min_value == '' ? 0 : body.min_value;
      body.max_value = body.max_value == '' ? 0 : body.max_value;
      await this.testNormalRangeRep.update(id, body);
      const savedData = await this.testNormalRangeRep.findOne({
        select: [
          '_id',
          'archived',
          'condition',
          'created_at',
          'max_op',
          'max_value',
          'min_op',
          'min_value',
          'normal_range_for',
          'sequence',
          'test_id',
          'updated_at',
        ],
        relations: ['test_id'],
        where: { _id: id },
      });

      const { ...rest } = savedData;
      return new TestNormalRangeResponse({
        ...rest,
        created_at: savedData.created_at.getTime(),
        updated_at: savedData.updated_at.getTime(),
        updated_by: '',
        test_id: savedData.test_id._id,
      });
    } catch (err) {
      return err;
    }
  }

  async addTestNormalRange(
    data: TestNormalRangeRequest,
  ): Promise<TestNormalRangeResponse> {
    try {
      const body: any = { ...data };
      body.min_value = body.min_value == '' ? 0 : body.min_value;
      body.max_value = body.max_value == '' ? 0 : body.max_value;
      const savedTestRange = await this.testNormalRangeRep.save(body);
      const savedData = await this.testNormalRangeRep.findOne({
        select: [
          '_id',
          'archived',
          'condition',
          'created_at',
          'max_op',
          'max_value',
          'min_op',
          'min_value',
          'normal_range_for',
          'sequence',
          'test_id',
          'updated_at',
        ],
        relations: ['test_id'],
        where: { _id: savedTestRange._id },
      });

      const { ...rest } = savedData;
      return new TestNormalRangeResponse({
        ...rest,
        created_at: savedData.created_at.getTime(),
        updated_at: savedData.updated_at.getTime(),
        updated_by: '',
        test_id: savedData.test_id._id,
      });
    } catch (err) {
      return err;
    }
  }

  async deleteNormalRange(id: string): Promise<void> {
    try {
      await this.testNormalRangeRep.delete(id);
    } catch (err) {
      return err;
    }
  }
}
