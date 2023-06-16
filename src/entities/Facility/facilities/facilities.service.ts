import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transformSortField } from 'src/common/utils/transform-sorting';
import { Addons } from 'src/entities/addons/addons.entity';
import { Customers } from 'src/entities/customer/customer.entity';
import { getRepository, Like, Repository } from 'typeorm';
import { FacilityRequestDto } from '../dto/request.dto';
import { FacilityDto, ParentFacilityDto } from '../dto/response.dto';
import { Facility } from '../facility.entity';
import { Users } from 'src/entities/user/user.entity';
import { emailRegex } from 'src/common/helper/enums';
import { BaseService } from 'src/common/baseService';

@Injectable()
export class FacilitiesService {
  private facilityRep: BaseService<Facility>;
  private customerRep: BaseService<Customers>;
  private addonsRep: BaseService<Addons>;

  constructor(
    @InjectRepository(Facility)
    private facilityRepository: Repository<Facility>,
    @InjectRepository(Customers)
    private customerRepository: Repository<Customers>,
    @InjectRepository(Addons)
    private addonsRepository: Repository<Addons>,
  ) {
    this.facilityRep = new BaseService<Facility>(this.facilityRepository);
    this.customerRep = new BaseService<Customers>(this.customerRepository);
    this.addonsRep = new BaseService<Addons>(this.addonsRepository);
  }

  async getAll(
    skip: number,
    take: number,
    text?: string,
    sort?: string,
  ): Promise<FacilityDto[]> {
    let where: any = {};
    if (text) {
      where = [
        { name: Like(`%${text}%`) },
        { mobile_number: Like(`%${text}%`) },
        { city: Like(`%${text}%`) },
      ];
    }
    const data: any[] = await this.facilityRep.findAll({
      select: [
        '_id',
        'address',
        'city',
        'created_at',
        'email',
        'mobile_number',
        'name',
        'phone_number',
        'status',
        'type',
        'unique_id',
        'updated_at',
      ],
      relations: ['customer_id'],
      where,
      skip,
      take,
      order: transformSortField(sort),
    });
    data.forEach((item) => {
      Object.assign(item, { customer_id: item.customer_id?._id });
    });
    return data;
  }

  async getParentFacilities(customer_id: string): Promise<ParentFacilityDto[]> {
    const data: Facility[] = await this.facilityRep.findAll({
      select: ['_id', 'unique_id', 'name', 'city'],
      where: {
        customer_id: {
          _id: customer_id,
        },
        type: 'main',
      },
    });

    return data;
  }

  async getAllByCustomer(customer_id: string): Promise<FacilityDto[]> {
    const data = await this.facilityRep.findAll({
      select: [
        '_id',
        'address',
        'city',
        'created_at',
        'email',
        'mobile_number',
        'name',
        'phone_number',
        'status',
        'type',
        'unique_id',
        'updated_at',
      ],
      where: {
        customer_id: {
          _id: customer_id,
        },
      },
      relations: ['customer_id'],
    });
    data.forEach((info) => {
      let customer_id = info.customer_id?._id;
      delete info.customer_id;
      Object.assign(info, { customer_id });
    });
    return data;
  }

  async getSingle(id: string, queryFields: String[]): Promise<FacilityDto> {
    let where: any = {}; // Declare an empty where object

    if (id) {
      where._id = id;
    }
    const data = await this.facilityRep.findOne({
      select: [
        '_id',
        'address',
        'city',
        'created_at',
        'customer_id',
        'email',
        'mobile_number',
        'name',
        'phone_number',
        'status',
        'type',
        'unique_id',
        'updated_at',
      ],
      relations: ['customer_id', 'laboratory_id', 'parent_facility_id'],
      where,
    });
    queryFields?.map((query) => {
      if (query == 'customer') {
        Object.assign(data, { customer: data.customer_id });
      } else if (query == 'laboratories') {
        Object.assign(data, { laboratories: data.laboratory_id });
      }
    });
    const { ...rest } = data;
    return new FacilityDto({
      ...rest,
      customer_id: data.customer_id?._id,
      created_at: data.created_at?.getTime(),
      updated_at: data.updated_at?.getTime(),
      updated_by: '',
      parent_facility_id: data.parent_facility_id?._id,
    });
  }

  async add(body: FacilityRequestDto): Promise<FacilityDto> {
    if (body.email && body.email !== '') {
      if (!emailRegex.test(body.email)) {
        throw [
          {
            field: 'email',
            message: 'Email is not a valid email address.',
          },
        ];
      }
    }
    const customer = await this.customerRep.findOne({
      where: { _id: body.customer_id },
    });
    body.customer_id = customer;
    const data = await this.facilityRep.save(body);
    const addon = new Addons();
    addon.facility_id = data._id;
    addon.sms = JSON.stringify({
      status: false,
      settings: {
        registration: false,
        payment_done: false,
        reports_done: true,
      },
    });
    addon.whatsapp = JSON.stringify({
      status: true,
      settings: {
        registration: true,
        payment_done: false,
        reports_done: true,
      },
    });
    await this.addonsRep.save(addon);

    const { ...rest } = data;
    return new FacilityDto({
      ...rest,
      created_at: data.created_at.getTime(),
      updated_at: data.updated_at.getTime(),
      updated_by: '',
    });
  }

  async update(id: string, body: FacilityRequestDto): Promise<FacilityDto> {
    try {
      if (body.email && body.email !== '') {
        if (!emailRegex.test(body.email)) {
          throw [
            {
              field: 'email',
              message: 'Email is not a valid email address.',
            },
          ];
        }
      }
      await this.facilityRep.update(id, body);
      const data = await this.facilityRep.findOne({
        select: [
          '_id',
          'address',
          'city',
          'created_at',
          'customer_id',
          'email',
          'mobile_number',
          'name',
          'phone_number',
          'status',
          'type',
          'unique_id',
          'updated_at',
        ],
        relations: ['customer_id', 'parent_facility_id'],
        where: { _id: id },
      });
      const { ...rest } = data;
      return new FacilityDto({
        ...rest,
        customer_id: data.customer_id?._id,
        created_at: data.created_at?.getTime(),
        updated_at: data.updated_at?.getTime(),
        updated_by: '',
        parent_facility_id: data.parent_facility_id?._id,
      });
    } catch (err) {
      throw err;
    }
  }

  async delete(id: string): Promise<any> {
    try {
      return await this.facilityRep.softDelete(id);
    } catch (err) {
      throw err;
    }
  }

  async getFacility(user): Promise<any> {
    try {
      const data = await this.facilityRep.findOne({
        select: [
          '_id',
          'address',
          'city',
          'created_at',
          'email',
          'mobile_number',
          'facility_image_name',
          'name',
          'phone_number',
          'status',
          'type',
          'unique_id',
          'updated_at',
        ],
        where: { _id: user.facility_id },
        relations: ['customer_id'],
      });
      const { ...rest } = data;
      return {
        ...rest,
        customer_id: data.customer_id._id,
      };
    } catch (err) {
      throw err;
    }
  }

  async findAndUpdate(facility_id, data: FacilityDto, path): Promise<any> {
    try {
      const facility = await this.facilityRep.findOne({
        where: { _id: facility_id },
      });
      if (facility) {
        facility.unique_id = data?.unique_id;
        facility.name = data?.name;
        facility.email = data?.email;
        // facility.customer_id = data?.customer_id
        facility.address = data?.address;
        facility.phone_number = data?.phone_number;
        facility.city = data?.city;
        facility.mobile_number = data?.mobile_number;
        facility.type = data?.type;
        if (path != null && path != undefined) {
          facility.facility_image_name = path;
        }
        const resp = await this.facilityRep.update(facility_id, facility);
        return resp;
      }
    } catch (err) {
      throw err;
    }
  }
  async getSingleFacilityById(facility_id): Promise<any> {
    return await this.facilityRep.findOne({ where: { _id: facility_id } });
  }
}
