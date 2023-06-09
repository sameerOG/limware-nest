import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transformSortField } from 'src/common/utils/transform-sorting';
import { Department } from 'src/entities/department/department.entity';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { Repository, Like } from 'typeorm';
import { TestCategoryRequestDto } from '../dto/test-category/request.dto';
import {
  SingleTestCategory,
  TestCategoryDto,
} from '../dto/test-category/response.dto';
import { Test } from '../test.entity';
import { TestCategory } from '../test_category.entity';

@Injectable()
export class TestCategoriesService {
  constructor(
    @InjectRepository(TestCategory)
    private testCategoryRep: Repository<TestCategory>,
    @InjectRepository(Laboratory)
    private labRep: Repository<Laboratory>,
    @InjectRepository(Test)
    private testRep: Repository<Test>,
  ) {}

  async getAll(
    user,
    skip: number,
    take: number,
    text?: string,
    sort?: string,
  ): Promise<TestCategoryDto[]> {
    let where: any = {}; // Declare an empty where object

    if (text) {
      where = [
        { name: Like(`%${text}%`) },
        { description: Like(`%${text}%`) },
        { title_for_print: Like(`%${text}%`) },
      ];
    }
    const data = await this.testCategoryRep.find({
      select: ['_id', 'name', 'title_for_print', 'description', 'is_template'],
      relations: ['facility_id', 'department_id'],
      where,
      skip,
      take,
      order: transformSortField(sort),
    });
    let filterData;
    if (user.portal === 'limware') {
      filterData = data.filter((info) => {
        if (info.department_id) {
          Object.assign(info, {
            department_id: info.department_id._id,
            department: {
              _id: info.department_id._id,
              name: info.department_id.name,
            },
          });
        } else {
          Object.assign(info, {
            department: {
              name: '',
            },
          });
        }
        return (
          info.facility_id?._id === user.facility_id ||
          info.is_template === true
        );
      });
    } else {
      filterData = data;
    }
    return filterData;
  }

  async getParentCategories(): Promise<TestCategoryDto[]> {
    return await this.testCategoryRep.find({ where: { is_template: true } });
  }

  async getAllComplete(): Promise<TestCategoryDto[]> {
    const data = await this.testCategoryRep.find({
      select: ['_id', 'name', 'report_template'],
    });
    return data;
  }

  async getSingle(id: string, expand?: string): Promise<TestCategoryDto> {
    let where: any = {};

    if (id) {
      where._id = id;
    }
    const data = await this.testCategoryRep.findOne({
      select: [
        '_id',
        'name',
        'is_template',
        'ref_code',
        'title_for_print',
        'type',
        'updated_at',
        'created_at',
        'report_template',
        'description',
      ],
      where,
      relations: ['test'],
    });
    Object.assign(data, { tests: data.test });
    return data;
  }

  async add(body: any, user): Promise<SingleTestCategory> {
    try {
      if (user.portal === 'limware') {
        const lab = await this.labRep
          .createQueryBuilder('laboratory')
          .select('laboratory.*')
          .where('laboratory.facility_id = :facility_id', {
            facility_id: user.facility_id,
          })
          .getRawOne();
        Object.assign(body, {
          facility_id: user.facility_id,
          laboratory_id: lab?._id,
          department_id: body.department_id,
        });
      }
      const data = await this.testCategoryRep.save(body);
      const { ...rest } = data;
      return new SingleTestCategory({
        ...rest,
        created_at: data.created_at.getTime(),
        updated_at: data.updated_at.getTime(),
        updated_by: '',
        tests: [],
      });
    } catch (err) {
      return err;
    }
  }

  async update(id: string, body: any): Promise<SingleTestCategory> {
    try {
      await this.testCategoryRep.update(id, body);
      const data = await this.testCategoryRep.findOne({
        select: [
          '_id',
          'name',
          'is_template',
          'ref_code',
          'title_for_print',
          'type',
          'updated_at',
          'created_at',
          'report_template',
          'description',
        ],
        where: { _id: id },
      });
      const { ...rest } = data;
      return new SingleTestCategory({
        ...rest,
        created_at: data.created_at.getTime(),
        updated_at: data.updated_at.getTime(),
        updated_by: '',
      });
    } catch (err) {
      return err;
    }
  }

  async delete(id: string): Promise<any> {
    try {
      return await this.testCategoryRep.softDelete(id);
    } catch (err) {
      return err;
    }
  }
}
