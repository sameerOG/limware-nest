import { Injectable } from '@nestjs/common';
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
import { TestParameterRequest } from '../dto/test-category/request.dto';
@Injectable()
export class TestParametersService {
  constructor(
    @InjectRepository(TestParameter)
    private testParameterRep: Repository<TestParameter>,
    @InjectRepository(Laboratory) private labRep: Repository<Laboratory>,
    @InjectRepository(TestGroup) private testGroupRep: Repository<TestGroup>,
    @InjectRepository(Test) private testRep: Repository<Test>,
  ) {}

  async getAllParameters(
    parent_test_id: string,
    user,
  ): Promise<TestParameterResponse> {
    const query: any = {
      where: {
        archived: Not(true), // equivalent to `archived IS NULL OR archived = false`
      },
      select: [
        '_id',
        'parent_test_id',
        'child_test_id',
        'test_group_id',
        'sequence',
      ],
      relations: ['test_group_id', 'parent_test_id'],
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
        laboratoryId: labModel._id,
      };
    }
    const testParameter = await this.testParameterRep.find(query);
    const filteredResult = testParameter.filter((info) => {
      return info.parent_test_id._id === parent_test_id;
    });
    return this.__prepareDataset(filteredResult);
  }

  async getTestParameter(
    id: string,
    user,
  ): Promise<SingleParameterTestResponse> {
    let query = this.testParameterRep
      .createQueryBuilder('test_parameter')
      .where('test_parameter._id = :id', { id });

    if (user.portal === 'limware') {
      const labModel = await this.labRep.findOne({
        where: { facility_id: user.facility_id },
      });
      query = query
        .andWhere('test_parameter.facility_id = :facility_id', {
          facility_id: user.facility_id,
        })
        .andWhere('test_parameter.laboratory_id = :laboratory_id', {
          laboratory_id: labModel._id,
        });
    }

    const testParameter = await query.getRawOne();
    return testParameter;
  }

  async createParameterTest(
    body: TestParameterRequest,
  ): Promise<CreateParameterTestResponse> {
    const data: any = { ...body };
    const testParameter = await this.testParameterRep.save(data);
    const savedData = await this.testParameterRep
      .createQueryBuilder('test_parameter')
      .select('test_parameter.*')
      .where('test_parameter._id = :_id', { _id: testParameter._id })
      .getRawOne();

    const { ...rest } = savedData;
    return new CreateParameterTestResponse({
      ...rest,
      updated_by: '',
      created_at: savedData.created_at.getTime(),
      updated_at: savedData.updated_at.getTime(),
    });
  }

  async getAllGroups(
    parent_id: string,
    parent: string,
    user,
  ): Promise<AllGroups[]> {
    const testGroups = this.testGroupRep
      .createQueryBuilder('testGroup')
      .where('testGroup.archived IS NULL OR testGroup.archived = false')
      .andWhere('testGroup.parent = :parent', { parent })
      .andWhere('testGroup.parent_id = :parent_id', { parent_id })
      .orderBy('testGroup.sequence', 'ASC');

    if (user.portal === 'limware') {
      const labModel = await this.labRep
        .createQueryBuilder('laboratory')
        .select('laboratory._id')
        .where('laboratory.facility_id = :facility_id', {
          facility_id: user.facility_id,
        })
        .getRawOne();

      testGroups
        .andWhere('testGroup.facility_id = :facility_id', {
          facility_id: user.facility_id,
        })
        .andWhere('testGroup.laboratory_id = :laboratory_id', {
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
        archived: Not(true), // equivalent to `archived IS NULL OR archived = false`
      },
      relations: ['test_category_id'],
    });

    if (test?.test_category_id.type === 'general') {
      let mappedTests: any = await this.testParameterRep
        .createQueryBuilder('test_parameter')
        .select('test_parameter.*')
        .where('test_parameter.parent_test_id = :parent_test_id', {
          parent_test_id,
        })
        .andWhere(
          'test_parameter.archived IS NULL OR test_parameter.archived = false',
        );

      if (user.portal === 'limware') {
        mappedTests = mappedTests
          .andWhere('test_parameter.facility_id = :facility_id', {
            facility_id: user.facility_id,
          })
          .andWhere('test_parameter.laboratory_id = :laboratory_id', {
            laboratory_id: labModel._id,
          });
      }
      mappedTests.getRawMany();

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
      .andWhere('(test.archived IS NULL OR test.archived = :archived)', {
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
            sequence: group.sequence,
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
