import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { Not, Repository } from 'typeorm';
import {
  AllGroups,
  CreateParameterTestResponse,
  SingleParameterTestResponse,
  TestParameterResponse,
  UnassignedParameters,
} from '../dto/test-category/response.dto';
import { TestParameter } from '../test_parameter.entity';
import { isEmpty } from 'lodash';
import { TestGroup } from '../test_group.entity';
import { Test } from '../test.entity';
import {
  TestParameterRequest,
  UpdateTestParameterRequestDto,
} from '../dto/test-category/request.dto';
import { TestsService } from '../tests/tests.service';
import { LaboratoriesModule } from 'src/entities/laboratory/laboratories/laboratories.module';
import { TestNormalRange } from '../test_normal_range.entity';
import { PatientTest } from 'src/entities/patient/patient_test.entity';
import { PatientTestParameterResult } from 'src/entities/patient/patient_test_parameter_result.entity';
@Injectable()
export class TestParametersService {
  constructor(
    @InjectRepository(TestParameter)
    private testParameterRep: Repository<TestParameter>,
    @InjectRepository(Laboratory) private labRep: Repository<Laboratory>,
    @InjectRepository(TestGroup) private testGroupRep: Repository<TestGroup>,
    @InjectRepository(Test) private testRep: Repository<Test>,
    @InjectRepository(PatientTest)
    private patientTestRep: Repository<PatientTest>,
    @InjectRepository(PatientTestParameterResult)
    private patientTestParamResultRep: Repository<PatientTestParameterResult>,
    @InjectRepository(TestNormalRange)
    private normalRangeRep: Repository<TestNormalRange>,
    private testService: TestsService,
  ) {}

  async getAllParameters(
    parent_test_id: string,
    user,
  ): Promise<TestParameterResponse> {
    const query: any = {
      where: {
        archived: false, // equivalent to `archived IS NULL OR archived = false`
      },
      select: [
        '_id',
        'parent_test_id',
        'child_test_id',
        'test_group_id',
        'sequence',
      ],
      relations: [
        'test_group_id',
        'parent_test_id',
        'child_test_id',
        'child_test_id.uom_id',
      ],
    };
    if (user.portal === 'limware') {
      const labModel = await this.labRep
        .createQueryBuilder('laboratory')
        .select('laboratory.*')
        .where('laboratory.facility_id = :facility_id', {
          facility_id: user.facility_id,
        })
        .getRawOne();

      query.where = {
        ...query.where,
        parent_test_id: { _id: parent_test_id },
        // laboratory_id: { _id: labModel._id },
      };
    }
    const testParameter = await this.testParameterRep.find(query);
    const filteredResult = testParameter.filter((info) => {
      return info.parent_test_id._id === parent_test_id;
    });
    return this.__prepareDataset(filteredResult);
  }

  async getTestParameter(id: string, user): Promise<any> {
    let testParameter = await this.testParameterRep
      .createQueryBuilder('test_parameter')
      .select('test_parameter.*')
      .where('test_parameter._id = :_id', { _id: id })
      .getRawOne();

    if (user.portal === 'limware') {
      const labModel = await this.labRep
        .createQueryBuilder('laboratory')
        .select('laboratory._id')
        .where('laboratory.facility_id = :facility_id', {
          facility_id: user.facility_id,
        })
        .getRawOne();
      testParameter = await this.testParameterRep
        .createQueryBuilder('test_parameter')
        .select('test_parameter.*')
        .where('test_parameter._id = :_id', { _id: id })
        .andWhere('test_parameter.facility_id = :facility_id', {
          facility_id: user.facility_id,
        })
        .andWhere('test_parameter.laboratory_id = :laboratory_id', {
          laboratory_id: labModel._id,
        })
        .getRawOne();
    }

    return testParameter;
  }

  async createParameterTest(body: any, user): Promise<any> {
    const parentTest = await this.testRep
      .createQueryBuilder('test')
      .select('test.*')
      .where('test._id = :_id', {
        _id: body.parent_test_id,
      })
      .getRawOne();

    if (parentTest) {
      body.test_category_id = parentTest.test_category_id;
      body.parametric_only = true;
      body.single_or_group = 'single';
      body.print_on_separate_page = false;
      body.specimen_id = parentTest.specimen_id;
      body.department_id = parentTest.department_id;
    }

    const test = await this.testService.createSingleTest(body, user);
    if (test) {
      const tpData = {
        test_group_name: body.test_group_name ? body.test_group_name : null,
        test_group_id: body.test_group_id ? body.test_group_id : null,
        parent_test_id: body.parent_test_id,
        child_test_ids: [test._id],
      };
      await this.createMultiple(tpData, user);
      return test;
    }
  }

  async createMultiple(data, user) {
    const labModel = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory._id')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    let testGroupId = null;

    if (!isEmpty(data.test_group_name)) {
      let groupModal = new TestGroup();
      if (user.portal === 'limware') {
        groupModal.facility_id = user.facility_id;
        groupModal.laboratory_id = labModel._id;
      }
      groupModal.parent = 'test';
      groupModal.parent_id = data.parent_test_id;
      groupModal.name = data.test_group_name;
      const savedGroup = await this.testGroupRep.save(groupModal);
      if (savedGroup) {
        testGroupId = savedGroup._id;
      } else {
        throw { code: 12, message: 'Unable to save group' };
      }
    } else {
      testGroupId = data.test_group_id ? data.test_group_id : '';
    }

    data.child_test_ids.forEach(async (child_test_id) => {
      let obj = {
        parent_test_id: data.parent_test_id,
        child_test_id,
      };

      if (user.portal === 'limware') {
        Object.assign(obj, {
          facility_id: user.facility_id,
          laboratory_id: labModel._id,
        });
      }

      if (testGroupId) {
        Object.assign(obj, { test_group_id: testGroupId });
      }

      await this.testParameterRep.save(obj);
    });
    return true;
  }

  async updateTestParameter(
    id: string,
    body: UpdateTestParameterRequestDto,
    user,
  ): Promise<TestParameter> {
    const labModel = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    let testGroupId;
    if (!isEmpty(body.test_group_name)) {
      let groupModel = new TestGroup();
      if (user.portal === 'limware') {
        groupModel = user.facility_id;
        groupModel.laboratory_id = labModel._id;
      }

      groupModel.parent = 'test';
      groupModel.parent_id = body.parent_test_id;
      groupModel.name = body.test_group_name;

      const savedGroup = await this.testGroupRep.save(groupModel);
      if (savedGroup) {
        testGroupId = savedGroup._id;
      } else {
        throw { code: 12, message: 'Unable to save group' };
      }
    } else {
      testGroupId = body.test_group_id ? body.test_group_id : '';
    }
    let testParameter;
    if (labModel) {
      testParameter = await this.testParameterRep
        .createQueryBuilder('test_parameter')
        .select('test_parameter.*')
        .where('test_parameter._id = :_id', {
          _id: id,
        })
        .andWhere('test_parameter.facility_id = :facility_id', {
          facility_id: user.facility_id,
        })
        .andWhere('test_parameter.laboratory_id = :laboratory_id', {
          laboratory_id: labModel._id,
        })
        .getRawOne();
    } else {
      testParameter = await this.testParameterRep
        .createQueryBuilder('test_parameter')
        .select('test_parameter.*')
        .where('test_parameter._id = :_id', {
          _id: id,
        })
        .getRawOne();
    }
    if (testParameter) {
      // await this.testParameterRep.update(testParameter._id, testParameter);
      await this.testParameterRep
        .createQueryBuilder('test_parameter')
        .update(TestParameter)
        .set({ test_group_id: testGroupId })
        .where('test_parameter._id = :_id', { _id: testParameter._id })
        .execute();
      return testParameter;
    }
  }

  async deleteTestParameter(id: string, user): Promise<any> {
    let testParameter;
    if (user.portal === 'limware') {
      const labModel = await this.labRep
        .createQueryBuilder('laboratory')
        .select('laboratory._id')
        .where('laboratory.facility_id = :facility_id', {
          facility_id: user.facility_id,
        })
        .getRawOne();
      testParameter = await this.testParameterRep
        .createQueryBuilder('test_parameter')
        .select('test_parameter.*')
        .where('test_parameter._id = :_id', { _id: id })
        .andWhere('test_parameter.facility_id = :facility_id', {
          facility_id: user.facility_id,
        })
        .andWhere('test_parameter.laboratory_id = :laboratory_id', {
          laboratory_id: labModel._id,
        })
        .getRawOne();
    } else {
      testParameter = await this.testParameterRep
        .createQueryBuilder('test_parameter')
        .select('test_parameter.*')
        .where('test_parameter._id = :_id', { _id: id })
        .getRawOne();
    }

    const test = await this.testRep.findOne({
      where: { _id: testParameter.child_test_id },
      relations: [
        'test_normal_range',
        'test_parameter_parent',
        'test_parameter_child',
      ],
    });

    const updatedTestParameter = await this.testParameterRep
      .createQueryBuilder('test_parameter')
      .update(TestParameter)
      .set({ archived: true })
      .where('test_parameter._id = :_id', { _id: testParameter._id })
      .execute();

    if (updatedTestParameter) {
      if (test) {
        await this.deleteTest(test);
      }
    }
    return testParameter;
  }

  async deleteTest(data: Test): Promise<any> {
    let patientTestsCount = await this.patientTestRep
      .createQueryBuilder('patient_test')
      .where('patient_test.test_id = :test_id', { test_id: data._id })
      .getCount();

    let patientTestsParametersCount = await this.patientTestParamResultRep
      .createQueryBuilder('patient_test_parameter_result')
      .where('patient_test_parameter_result.test_id = :test_id', {
        test_id: data._id,
      })
      .getCount();

    if (patientTestsCount === 0 && patientTestsParametersCount === 0) {
      return await this.testRep.softDelete(data._id);
    } else if (patientTestsCount > 0 || patientTestsParametersCount > 0) {
      return await this._archiveEverything(
        data,
        patientTestsCount,
        patientTestsParametersCount,
      );
    }
  }

  async _archiveEverything(
    data: Test,
    patientTestsCount: number,
    patientTestsParametersCount: number,
  ): Promise<any> {
    if (patientTestsCount > 0 || patientTestsParametersCount > 0) {
      data.test_normal_range.forEach(async (nr) => {
        await this.normalRangeRep
          .createQueryBuilder('test_normal_range')
          .update(TestNormalRange)
          .set({ archieved: true })
          .where('test_normal_range.test_id = :test_id', { test_id: data._id })
          .execute();
      });

      data.test_parameter_parent.forEach(async (tpp) => {
        await this.testParameterRep
          .createQueryBuilder('test_parameter')
          .update(TestParameter)
          .set({ archieved: true })
          .where('test_parameter._id = :_id', { _id: tpp._id })
          .execute();
      });

      data.test_parameter_child.forEach(async (tpc) => {
        await this.testParameterRep
          .createQueryBuilder('test_parameter')
          .update(TestParameter)
          .set({ archieved: true })
          .where('test_parameter._id = :_id', { _id: tpc._id })
          .execute();
      });
    }
  }

  async getAllGroups(
    parent_id: string,
    parent: string,
    user,
  ): Promise<AllGroups[]> {
    const testGroups = this.testGroupRep
      .createQueryBuilder('test_group')
      .select('test_group.*')
      .where('test_group.archived IS NULL OR test_group.archived = false')
      .andWhere('test_group.parent = :parent', { parent })
      .andWhere('test_group.parent_id = :parent_id', { parent_id })
      .orderBy('test_group.sequence', 'ASC');

    if (user.portal === 'limware') {
      const labModel = await this.labRep
        .createQueryBuilder('laboratory')
        .select('laboratory._id')
        .where('laboratory.facility_id = :facility_id', {
          facility_id: user.facility_id,
        })
        .getRawOne();

      testGroups
        .andWhere('test_group.facility_id = :facility_id', {
          facility_id: user.facility_id,
        })
        .andWhere('test_group.laboratory_id = :laboratory_id', {
          laboratory_id: labModel._id,
        });
    }

    return testGroups.getRawMany();
  }

  async getUnassignedParameters(
    parent_test_id: string,
    user,
  ): Promise<UnassignedParameters[]> {
    const labModel = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    let assignedParametersIds = [];
    assignedParametersIds.push(parent_test_id);

    const test = await this.testRep.findOne({
      where: {
        _id: parent_test_id,
        archived: false, // equivalent to `archived IS NULL OR archived = false`
      },
      relations: ['test_category_id'],
    });

    if (
      test?.test_category_id.type === 'general' ||
      test?.test_category_id.type === ''
    ) {
      let mappedTests: any;

      if (user.portal === 'limware') {
        mappedTests = await this.testParameterRep
          .createQueryBuilder('test_parameter')
          .select('test_parameter.*')
          .where('test_parameter.parent_test_id = :parent_test_id', {
            parent_test_id,
          })
          .andWhere(
            'test_parameter.archived IS NULL OR test_parameter.archived = false',
          )
          .andWhere('test_parameter.facility_id = :facility_id', {
            facility_id: user.facility_id,
          })
          .andWhere('test_parameter.laboratory_id = :laboratory_id', {
            laboratory_id: labModel._id,
          })
          .getRawMany();
      } else {
        mappedTests = await this.testParameterRep
          .createQueryBuilder('test_parameter')
          .select('test_parameter.*')
          .where('test_parameter.parent_test_id = :parent_test_id', {
            parent_test_id,
          })
          .andWhere(
            'test_parameter.archived IS NULL OR test_parameter.archived = false',
          )
          .getRawMany();
      }

      for (let i = 0; i < mappedTests.length; i++) {
        assignedParametersIds.push(mappedTests[i].child_test_id);
      }
    }

    const tests = await this.testRep
      .createQueryBuilder('test')
      .select('test.*')
      .where('test.single_or_group = :single_or_group', {
        single_or_group: 'single',
      })
      .andWhere('test.archived = :archived', {
        archived: false,
      })
      .andWhere(`test._id NOT IN (:...assignedParametersIds)`, {
        assignedParametersIds,
      })
      .orderBy('test.name', 'ASC');

    if (user.portal === 'limware') {
      tests
        .andWhere('test.facility_id = :facility_id', {
          facility_id: user.facility_id,
        })
        .andWhere('test.laboratory_id = :laboratory_id', {
          laboratory_id: labModel._id,
        });
    } else {
      tests.andWhere('test.is_template = :is_template', { is_template: true });
    }
    return tests.getRawMany();
  }

  async __prepareDataset(data) {
    const singleTests = [];
    const groups = [];

    for (let i = 0; i < data.length; i++) {
      let parent_test_id = data[i].parent_test_id?._id;
      let childTestWithDetailsObj = data[i].child_test_id;
      if (childTestWithDetailsObj) {
        const { code, name, sequence, single_or_group, title_for_print, _id } =
          childTestWithDetailsObj;
        const childTestWithDetails = {
          code,
          name,
          sequence,
          single_or_group,
          title_for_print,
          _id,
          normal_range: [],
        };
        let child_test_id = data[i].child_test_id?._id;
        Object.assign(data[i], {
          parent_test_id,
          child_test_id,
          childTestWithDetails,
        });
      }
      delete data.parent_test_id;
      delete data.child_test_id;
      const parameterItem = data[i];
      const testGroupId = parameterItem.test_group_id?._id;
      delete parameterItem.test_group_id;
      Object.assign(parameterItem, { test_group_id: testGroupId });
      if (isEmpty(testGroupId)) {
        singleTests.push(parameterItem);
      } else {
        let groupAlreadyAdded = false;
        groups.forEach((groupItem) => {
          if (groupItem._id === parameterItem.test_group_id) {
            groupAlreadyAdded = true;
          }
        });

        if (!groupAlreadyAdded) {
          const group = await this.testGroupRep.findOne({
            where: { _id: testGroupId },
          });
          groups.push({
            _id: group._id,
            name: group.name,
            sequence: group.sequence ? group.sequence : 1,
            tests: [],
          });
        }
      }
    }

    for (let i = 0; i < groups.length; i++) {
      const groupItem = groups[i];
      for (let j = 0; j < data.length; j++) {
        const parameterItem = data[j];
        if (parameterItem.test_group_id === groupItem._id) {
          groupItem.tests.push(parameterItem);
        }
      }
    }

    return {
      singleTests,
      groups,
    };
  }
}
