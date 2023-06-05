import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transformSortField } from 'src/common/utils/transform-sorting';
import { Like, Repository } from 'typeorm';
import { LaboratoryRequestDto } from '../dto/request.dto';
import { LabRequestDto, LabResponseDto } from '../dto/response.dto';
import { Laboratory } from '../laboratory.entity';

@Injectable()
export class LaboratoriesService {
  constructor(
    @InjectRepository(Laboratory)
    private labRep: Repository<Laboratory>,
  ) {}

  async getAll(
    skip: number,
    take: number,
    text?: string,
    sort?: string,
  ): Promise<LabResponseDto[]> {
    let where: any = {};
    if (text) {
      where = [
        { name: Like(`%${text}%`) },
        { mobile_number: Like(`%${text}%`) },
        { type: Like(`%${text}%`) },
      ];
    }
    const data: any[] = await this.labRep.find({
      select: ['_id', 'mobile_number', 'name', 'status', 'type', 'unique_id'],
      relations: ['customer_id', 'facility_id'],
      where,
      skip,
      take,
      order: transformSortField(sort),
    });
    data.forEach((item) => {
      Object.assign(item, {
        customer_id: item.customer_id?._id,
        facility_id: item.facility_id?._id,
      });
    });
    return data;
  }

  async getMainLab(customer_id: string): Promise<LabResponseDto[]> {
    const data = await this.labRep
      .createQueryBuilder('laboratory')
      .select(
        'laboratory._id,laboratory.mobile_number,laboratory.name,laboratory.status,laboratory.type,laboratory.unique_id,laboratory.customer_id,laboratory.facility_id',
      )
      .where(`laboratory.customer_id = :customer_id`, { customer_id })
      .getRawMany();
    return data;
  }

  async getSingle(id: string, queryFields: String[]): Promise<LabRequestDto> {
    let where: any = {}; // Declare an empty where object

    if (id) {
      where._id = id;
    }
    const data = await this.labRep.findOne({
      select: [
        '_id',
        'mobile_number',
        'name',
        'status',
        'type',
        'unique_id',
        'created_at',
        'updated_at',
      ],
      relations: ['customer_id', 'facility_id'],
      where,
    });
    queryFields?.map((query) => {
      if (query == 'customer') {
        Object.assign(data, {
          customer: data.customer_id,
          facility: data.facility_id,
        });
      }
    });
    const { ...rest } = data;
    return new LabRequestDto({
      ...rest,
      customer_id: data.customer_id?._id,
      facility_id: data.facility_id?._id,
      created_at: data.created_at?.getTime(),
      updated_at: data.updated_at?.getTime(),
      updated_by: '',
    });
  }

  async getByCustomer(id: string): Promise<LabRequestDto[]> {
    const data: any = await this.labRep.find({
      select: [
        '_id',
        'mobile_number',
        'name',
        'status',
        'type',
        'unique_id',
        'created_at',
        'updated_at',
      ],
      relations: ['customer_id', 'facility_id'],
    });
    const filterdData = data?.filter((info) => {
      return info.customer_id?._id === id;
    });
    filterdData.map((lab) => {
      const { ...rest } = lab;
      return new LabRequestDto({
        ...rest,
        customer_id: lab.customer_id?._id,
        facility_id: lab.facility_id?._id,
        created_at: lab.created_at?.getTime(),
        updated_at: lab.updated_at?.getTime(),
        updated_by: '',
      });
    });
    return filterdData;
  }

  async add(body: LaboratoryRequestDto): Promise<LabRequestDto> {
    const data = await this.labRep.save(body);
    const { ...rest } = data;
    return new LabRequestDto({
      ...rest,
      created_at: data.created_at.getTime(),
      updated_at: data.updated_at.getTime(),
      updated_by: '',
    });
  }

  async update(id: string, body: LaboratoryRequestDto): Promise<LabRequestDto> {
    try {
      await this.labRep.update(id, body);
      const data = await this.labRep.findOne({
        select: [
          '_id',
          'mobile_number',
          'name',
          'status',
          'type',
          'unique_id',
          'created_at',
          'updated_at',
        ],
        relations: ['customer_id', 'facility_id'],
        where: { _id: id },
      });
      const { ...rest } = data;
      return new LabRequestDto({
        ...rest,
        customer_id: data.customer_id?._id,
        facility_id: data.facility_id?._id,
        created_at: data.created_at?.getTime(),
        updated_at: data.updated_at?.getTime(),
        updated_by: '',
      });
    } catch (err) {
      return err;
    }
  }

  async delete(id: string): Promise<any> {
    try {
      return await this.labRep.softDelete(id);
    } catch (err) {
      return err;
    }
  }
}
