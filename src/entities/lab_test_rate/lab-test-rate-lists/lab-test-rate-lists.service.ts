import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transformSortField } from 'src/common/utils/transform-sorting';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { Test } from 'src/entities/test/test.entity';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { LabTestRateList } from '../lab_test_rate_list.entity';
import { LabTestRateListItem } from '../lab_test_rate_list_item.entity';
import { LabTestRateListRequestDto } from './dto/request.dto';
import {
  GetAllTestsResponseDto,
  RateListCreateResponseDto,
  RateListResponseDto,
} from './dto/response.dto';
import { FileHandling } from 'src/common/file-handling';
import { options } from 'src/common/helper/enums';

@Injectable()
export class LabTestRateListsService {
  constructor(
    @InjectRepository(Test)
    private testRep: Repository<Test>,
    @InjectRepository(Laboratory)
    private labRep: Repository<Laboratory>,
    @InjectRepository(LabTestRateList)
    private labTestRateListRep: Repository<LabTestRateList>,
    @InjectRepository(LabTestRateListItem)
    private labTestRateListItemRep: Repository<LabTestRateListItem>,
    private fileHandling: FileHandling,
  ) {}

  async printRateList(id: string, user): Promise<any> {
    const labModel = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();
    let laboratory_id = labModel?._id;
    let facility_id = user.facility_id;
    if (labModel?.type == 'cc') {
      const parentLabModel = await this.labRep
        .createQueryBuilder('laboratory')
        .select('laboratory.*')
        .where('laboratory._id = :_id', {
          _id: labModel.parent_lab_id,
        })
        .getRawOne();
      facility_id = parentLabModel?.facility_id;
      laboratory_id = parentLabModel?._id;
    }

    const labTestRateList = await this.labTestRateListRep
      .createQueryBuilder('lab_test_rate_list')
      .select('lab_test_rate_list.*')
      .where('lab_test_rate_list._id = :_id', { _id: id })
      .andWhere('lab_test_rate_list.facility_id = :facility_id', {
        facility_id,
      })
      .andWhere('lab_test_rate_list.laboratory_id = :laboratory_id', {
        laboratory_id,
      })
      .getRawOne();

    console.log('labTestRateList', labTestRateList);

    const labTestRateListItem = await this.labTestRateListItemRep
      .createQueryBuilder('lab_test_rate_list_item')
      .select('lab_test_rate_list_item.price,lab_test_rate_list_item.test_id')
      .where(
        'lab_test_rate_list_item.lab_test_rate_list_id = :lab_test_rate_list_id',
        { lab_test_rate_list_id: labTestRateList?._id },
      )
      .getRawMany();

    let items = [];
    for (let i = 0; i < labTestRateListItem.length; i++) {
      const savedTest = await this.testRep.findOne({
        where: { _id: labTestRateListItem[i].test_id },
      });
      let test = {
        name: savedTest.name,
      };
      items.push({ test, price: labTestRateListItem[i].price });
    }
    Object.assign(labTestRateList, { items: items });

    let payload: any = {
      model: labTestRateList,
      labModel,
    };
    const reportTemplate = 'lab_test_rate_list';
    const content = await this.fileHandling.renderTemplate(
      reportTemplate,
      payload,
    );
    const folderPath = process.cwd() + '/src/common/uploads/invoices';
    const fileName = `${
      labTestRateList?._id
    }-lab-test-rate-list-${new Date().getTime()}.pdf`;
    const filePath = path.join(folderPath, fileName);
    return await this.fileHandling.generatePdf(options, content, filePath);
    // await fs.unlink(filePath, (err) => {
    //   if (err) {
    //     console.error(err);
    //     return err;
    //   }
    // });
    // return fileContent;
  }

  async create(
    body: LabTestRateListRequestDto,
    user,
  ): Promise<RateListCreateResponseDto> {
    const labModel = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    let rateListAttributes: any = {
      facility_id: user.facility_id,
      laboratory_id: labModel?._id,
      name: body.name,
      status: body.status,
    };

    const data = await this.labTestRateListRep.save(rateListAttributes);
    if (data) {
      for (let i = 0; i < body.items.length; i++) {
        let item: any = body.items[i];
        let itemAttributes = {
          facility_id: user.facility_id,
          laboratory_id: labModel?._id,
          lab_test_rate_list_id: data._id,
          test_id: item.test_id,
          price: item.price,
          name: body.name,
        };
        await this.labTestRateListItemRep.save(itemAttributes);
      }
    }
    return data;
  }

  async makeCopy(id: string, user): Promise<RateListCreateResponseDto> {
    const labModel = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    const labRateList = await this.labTestRateListRep
      .createQueryBuilder('lab_test_rate_list')
      .select('lab_test_rate_list.*')
      .where('lab_test_rate_list._id = :_id', { _id: id })
      .getRawOne();

    let rateListAttributes: any = {
      facility_id: user.facility_id,
      laboratory_id: labModel?._id,
      name: labRateList.name + ' (copy)',
      status: labRateList.status,
    };
    const data = await this.labTestRateListRep.save(rateListAttributes);
    if (labRateList && data) {
      const items = await this.labTestRateListItemRep
        .createQueryBuilder('lab_test_rate_list_item')
        .select('lab_test_rate_list_item.*')
        .where(
          'lab_test_rate_list_item.lab_test_rate_list_id = :lab_test_rate_list_id',
          {
            lab_test_rate_list_id: id,
          },
        )
        .getRawMany();
      for (let i = 0; i < items.length; i++) {
        let item: any = items[i];
        let itemAttributes: any = {
          facility_id: user.facility_id,
          laboratory_id: labModel?._id,
          lab_test_rate_list_id: data._id,
          test_id: item.test_id,
          price: item.price,
          name: labRateList.name + ' (copy)',
        };
        await this.labTestRateListItemRep.save(itemAttributes);
      }
    }
    return data;
  }

  async getAll(
    user,
    skip: number,
    take: number,
    sort?: string,
    filter?: string,
  ): Promise<RateListResponseDto[]> {
    const labModel = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    let facility_id: string = '';
    if (labModel?.type === 'cc') {
      facility_id = labModel.parent_facility_id;
    } else {
      facility_id = labModel.facility_id;
    }
    let data;
    if (filter) {
      data = await this.labTestRateListRep
        .createQueryBuilder('lab_test_rate_list')
        .select(
          'lab_test_rate_list._id,lab_test_rate_list.type,lab_test_rate_list.facility_id,lab_test_rate_list.status',
        )
        .where('lab_test_rate_list.facility_id = :facility_id', { facility_id })
        // .andWhere('lab_test_rate_list.status = :status', { status: 1 }) //confirm active status
        .andWhere('lab_test_rate_list.name LIKE :name', {
          name: `%${filter['name']}%`,
        })
        .skip(skip)
        .take(take)
        .orderBy(transformSortField(sort))
        .getRawMany();
    } else {
      data = await this.labTestRateListRep
        .createQueryBuilder('lab_test_rate_list')
        .select(
          'lab_test_rate_list._id,lab_test_rate_list.name,lab_test_rate_list.facility_id,lab_test_rate_list.status',
        )
        .where('lab_test_rate_list.facility_id = :facility_id', { facility_id })
        // .andWhere('lab_test_rate_list.status = :status', { status: 1 })
        .getRawMany();
    }
    return data;
  }

  async getAllTests(user): Promise<GetAllTestsResponseDto[]> {
    let facility_id = user.facility_id;
    const labModel = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: facility_id,
      })
      .getRawOne();

    let laboratory_id = labModel?._id;
    if (labModel?.type === 'cc') {
      const parentLabModel = await this.labRep
        .createQueryBuilder('laboratory')
        .select('laboratory.*')
        .where('laboratory.parent_lab_id = :parent_lab_id', {
          parent_lab_id: labModel?._id,
        })
        .getRawOne();

      if (parentLabModel) {
        facility_id = parentLabModel.facility_id;
        laboratory_id = parentLabModel._id;
      }
    }
    const tests = await this.testRep
      .createQueryBuilder('test')
      .select('test._id,test.code,test.name')
      .where('test.laboratory_id = :laboratory_id', { laboratory_id })
      .andWhere('test.facility_id = :facility_id', { facility_id: facility_id })
      .orWhere('test.is_template = :is_template', { is_template: 1 })
      .andWhere(
        '(test.parametric_only IS NULL OR test.parametric_only = false)',
      )
      .andWhere('(test.archived IS NULL OR test.archived = false)')
      .orderBy('test.name', 'ASC')
      .getRawMany();
    return tests;
  }

  async findOne(id: string): Promise<any> {
    const data = await this.labTestRateListRep
      .createQueryBuilder('lab_test_rate_list')
      .select('lab_test_rate_list.*')
      .where('lab_test_rate_list._id = :_id', { _id: id })
      .getRawOne();
    if (data) {
      const items = await this.labTestRateListItemRep
        .createQueryBuilder('lab_test_rate_list_item')
        .select('lab_test_rate_list_item.*')
        .where(
          'lab_test_rate_list_item.lab_test_rate_list_id = :lab_test_rate_list_id',
          {
            lab_test_rate_list_id: id,
          },
        )
        .getRawMany();
      Object.assign(data, { items });
    }
    return data;
  }

  async update(
    id: string,
    body: LabTestRateListRequestDto,
    user,
  ): Promise<RateListCreateResponseDto> {
    const labRateList = await this.labTestRateListRep
      .createQueryBuilder('lab_test_rate_list')
      .update(LabTestRateList)
      .set({ name: body.name, status: body.status })
      .where('lab_test_rate_list._id = :_id', { _id: id })
      .execute();

    const savedData = await this.labTestRateListRep
      .createQueryBuilder('lab_test_rate_list')
      .select('lab_test_rate_list.*')
      .where('lab_test_rate_list._id = :_id', {
        _id: id,
      })
      .getRawOne();

    if (labRateList.affected > 0) {
      const labModel = await this.labRep
        .createQueryBuilder('laboratory')
        .select('laboratory.*')
        .where('laboratory.facility_id = :facility_id', {
          facility_id: user.facility_id,
        })
        .getRawOne();

      let facility_id: string = '';
      if (labModel?.type === 'cc') {
        facility_id = labModel.parent_facility_id;
      } else {
        facility_id = labModel.facility_id;
      }

      for (let i = 0; i < body.items.length; i++) {
        let item: any = body.items[i];
        await this.labTestRateListItemRep
          .createQueryBuilder('lab_test_rate_list_item')
          .update(LabTestRateListItem)
          .set({ price: item.price })
          .where('_id = :_id', {
            _id: item.rate_list_item_id,
          })
          .execute();
      }
    }

    return savedData;
  }

  async remove(id: string): Promise<any> {
    await this.labTestRateListItemRep
      .createQueryBuilder('lab_test_rate_list_item')
      .delete()
      .from(LabTestRateListItem)
      .where('lab_test_rate_list_id = :lab_test_rate_list_id', {
        lab_test_rate_list_id: id,
      })
      .execute();

    return await this.labTestRateListRep
      .createQueryBuilder('lab_test_rate_list')
      .delete()
      .from(LabTestRateList)
      .where('_id = :_id', { _id: id })
      .execute();
  }
}
