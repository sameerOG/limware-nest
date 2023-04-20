import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customers } from 'src/entities/customer/customer.entity';
import { Like, Repository } from 'typeorm';
import { FacilityRequestDto } from '../dto/request.dto';
import { FacilityDto } from '../dto/response.dto';
import { Facility } from '../facility.entity';

@Injectable()
export class FacilitiesService {
  constructor(
    @InjectRepository(Facility)
    private facilityRep: Repository<Facility>,
    @InjectRepository(Customers)
    private customerRep: Repository<Customers>,
  ) {}

  async getAll(
    skip: number,
    take: number,
    text?: string,
  ): Promise<FacilityDto[]> {
    const where: any = text && { name: Like(`%${text}%`) };
    const data: any[] = await this.facilityRep.find({
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
    });
    data.forEach((item) => {
      Object.assign(item, { customer_id: item.customer_id._id });
    });
    return data;
  }

  async getAllByCustomer(customer_id: string): Promise<FacilityDto[]> {
    const data: any = await this.facilityRep
      .createQueryBuilder('facility')
      .select(
        'facility._id,facility.address,facility.city,facility.created_at,facility.email,facility.mobile_number,facility.name,facility.phone_number,facility.status,facility.type,facility.unique_id,facility.updated_at',
      )
      .where('facility.customer_id = :customer_id', { customer_id })
      .getRawMany();
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
      relations: ['customer_id', 'laboratory_id'],
      where,
    });
    queryFields.map((query) => {
      if (query == 'customer') {
        Object.assign(data, { customer: data.customer_id });
      } else if (query == 'laboratories') {
        Object.assign(data, { laboratories: data.laboratory_id });
      }
    });
    const { ...rest } = data;
    return new FacilityDto({
      ...rest,
      customer_id: data.customer_id._id,
      created_at: data.created_at?.getTime(),
      updated_at: data.updated_at?.getTime(),
      updated_by: '',
    });
  }

  async add(body: FacilityRequestDto): Promise<FacilityDto> {
    const customer = await this.customerRep.findOne({
      where: { _id: body.customer_id },
    });
    body.customer_id = customer;
    const data = await this.facilityRep.save(body);
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
        relations: ['customer_id'],
        where: { _id: id },
      });
      const { ...rest } = data;
      return new FacilityDto({
        ...rest,
        customer_id: data.customer_id._id,
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
      return await this.facilityRep.softDelete(id);
    } catch (err) {
      return err;
    }
  }
}
