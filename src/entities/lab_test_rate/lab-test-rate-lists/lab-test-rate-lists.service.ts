import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { Test } from 'src/entities/test/test.entity';
import { Repository } from 'typeorm';
import { GetAllTestsResponseDto } from './dto/response.dto';

@Injectable()
export class LabTestRateListsService {
  constructor(
    @InjectRepository(Test)
    private testRep: Repository<Test>,
    @InjectRepository(Laboratory)
    private labRep: Repository<Laboratory>,
  ) {}
  create(createLabTestRateListDto: any) {
    return 'This action adds a new labTestRateList';
  }

  findAll() {
    return `This action returns all labTestRateLists`;
  }

  async getAllTests(user): Promise<GetAllTestsResponseDto> {
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
      .andWhere(
        '(test.parametric_only IS NULL OR test.parametric_only = false)',
      )
      .andWhere('(test.archived IS NULL OR test.archived = false)')
      .orderBy('test.name', 'ASC')
      .getRawMany();

    return;
  }

  findOne(id: number) {
    return `This action returns a #${id} labTestRateList`;
  }

  update(id: number, updateLabTestRateListDto: any) {
    return `This action updates a #${id} labTestRateList`;
  }

  remove(id: number) {
    return `This action removes a #${id} labTestRateList`;
  }
}
