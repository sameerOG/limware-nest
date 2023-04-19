import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { TestCategoryRequestDto } from '../dto/test-category/request.dto';
import {
  SingleTestCategory,
  TestCategoryDto,
} from '../dto/test-category/response.dto';
import { TestCategory } from '../test_category.entity';

@Injectable()
export class TestCategoriesService {
  constructor(
    @InjectRepository(TestCategory)
    private testCategoryRep: Repository<TestCategory>,
  ) {}

  async getAll(
    skip: number,
    take: number,
    text?: string,
  ): Promise<TestCategoryDto[]> {
    let where: any = {}; // Declare an empty where object

    if (text) {
      where.name = Like(`%${text}%`);
    }
    const customers = await this.testCategoryRep.find({
      select: ['_id', 'name', 'title_for_print', 'description'],
      where,
      skip,
      take,
    });
    return customers;
  }

  async getSingle(id: string, expand?: string): Promise<TestCategoryDto> {
    let where: any = {};

    if (id) {
      where._id = id;
    }
    const testCategory = await this.testCategoryRep.findOne({
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
    });
    return testCategory;
  }

  async add(data: TestCategoryRequestDto): Promise<SingleTestCategory> {
    try {
      const testCategory = await this.testCategoryRep.save(data);
      const { ...rest } = testCategory;
      return new SingleTestCategory({
        ...rest,
        created_at: testCategory.created_at.getTime(),
        updated_at: testCategory.updated_at.getTime(),
        updated_by: '',
        tests: [],
      });
    } catch (err) {
      return err;
    }
  }

  async update(
    id: string,
    data: TestCategoryRequestDto,
  ): Promise<SingleTestCategory> {
    try {
      await this.testCategoryRep.update(id, data);
      const savedTestCategory = await this.testCategoryRep.findOne({
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
      const { ...rest } = savedTestCategory;
      return new SingleTestCategory({
        ...rest,
        created_at: savedTestCategory.created_at.getTime(),
        updated_at: savedTestCategory.updated_at.getTime(),
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
