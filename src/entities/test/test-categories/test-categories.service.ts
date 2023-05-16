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
      where = [
        { name: Like(`%${text}%`) },
        { description: Like(`%${text}%`) },
        { title_for_print: Like(`%${text}%`) },
      ];
    }
    const data = await this.testCategoryRep.find({
      select: ['_id', 'name', 'title_for_print', 'description'],
      where,
      skip,
      take,
    });
    return data;
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
    });
    return data;
  }

  async add(body: TestCategoryRequestDto): Promise<SingleTestCategory> {
    try {
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

  async update(
    id: string,
    body: TestCategoryRequestDto,
  ): Promise<SingleTestCategory> {
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
