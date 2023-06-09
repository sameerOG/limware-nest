import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transformSortField } from 'src/common/utils/transform-sorting';
import { Like, Repository } from 'typeorm';
import { LaboratoryRequestDto } from '../dto/request.dto';
import { LabRequestDto, LabResponseDto } from '../dto/response.dto';
import { Laboratory } from '../laboratory.entity';
import { Facility } from 'src/entities/Facility/facility.entity';
import { FacilitiesService } from 'src/entities/Facility/facilities/facilities.service';
import { LaboratorySetting } from '../laboratory_setting.entity';
import { LaboratoriesSettingsDto } from 'src/entities/laboratory/laboratories_settings/laboratories.settings.dto';

@Injectable()
export class LaboratoriesService {
  constructor(
    @InjectRepository(Laboratory)
    private labRep: Repository<Laboratory>,
    @InjectRepository(LaboratorySetting)
    private labSetRep: Repository<LaboratorySetting>,
  ) { }

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
  async getLab(facility_id: any): Promise<any> {
    return await this.labRep.createQueryBuilder("laboratory")
      .select("laboratory.*")
      .where("laboratory.facility_id = :facility_id", { facility_id: facility_id })
      // .leftJoin('facility','f','f._id=laboratory.facility_id')
      .getRawOne();
  }

  // async getLabForSetting(facility_id: any): Promise<any>{
  //   return await this.labRep.createQueryBuilder("laboratory")
  //   .select("laboratory.*")
  //   .where("laboratory.facility_id = :facility_id",{facility_id:facility_id})
  //   // .leftJoin('facility','f','f._id=laboratory.facility_id')
  //   .getRawOne();
  // }

  async getLabForSetting(facility_id): Promise<Laboratory | any> {
    const data = await this.labRep.query(`select _id from public.laboratory where facility_id = '${facility_id}'`)
    return data[0];
  }
  async getSingleLabSettings(facility_id): Promise<LaboratorySetting | any> {
    const data = await this.labSetRep.query(`select * from public.laboratory_setting where facility_id = '${facility_id}'`)
    return data[0];
  }
  async updateLabSettings(data: LaboratoriesSettingsDto, facility_id, lab_id): Promise<LaboratorySetting | undefined> {
    const settings = await this.labSetRep.findOne({ where: { facility_id: facility_id } });
    if (settings) {      
      if (data.print_empty_result != undefined) {
        settings.print_empty_result = data.print_empty_result;
        return await this.labSetRep.save(settings);
      }
      if (data.require_results_for_mark_as_done != undefined) {
        settings.require_results_for_mark_as_done = data.require_results_for_mark_as_done;
        return await this.labSetRep.save(settings);
      }
    }
  }
  async getLabSettingForSaveTest(user): Promise<LaboratorySetting> {
    const labModel = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();
    if (labModel) {
      const laboratorySetting = await this.labSetRep.createQueryBuilder("laboratory_setting")
        .select("laboratory_setting.*")
        .where("laboratory_setting.laboratory_id = :laboratory_id", { laboratory_id: labModel._id })
        .getRawOne()
      return laboratorySetting
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
