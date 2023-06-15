import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { emailRegex } from 'src/common/helper/enums';
import { transformSortField } from 'src/common/utils/transform-sorting';
import { Repository, Like } from 'typeorm';
import { Customers } from '../customer.entity';
import { CustomerRequestDto } from '../dto/request.dto';
import { CustomerDto, SingleCustomerDto } from '../dto/response.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customers) private customerRep: Repository<Customers>,
  ) {}

  async getCustomers(
    skip: number,
    take: number,
    text?: string,
    sort?: string,
  ): Promise<CustomerDto[]> {
    let where: any = {}; // Declare an empty where object
    if (text) {
      // where.full_name = Like(`%${text}%`);
      where = [
        { name: Like(`%${text}%`) },
        { mobile_number: Like(`%${text}%`) },
        { email: Like(`%${text}%`) },
        { city: Like(`%${text}%`) },
      ];
    }
    const customers = await this.customerRep.find({
      select: ['_id', 'name', 'city', 'email', 'mobile_number', 'status'],
      where,
      skip,
      take,
      order: transformSortField(sort),
    });
    return customers;
  }

  async getCustomer(id: string): Promise<SingleCustomerDto> {
    let where: any = {}; // Declare an empty where object

    if (id) {
      where._id = id;
    }
    const customer = await this.customerRep.findOne({
      select: [
        '_id',
        'name',
        'city',
        'email',
        'mobile_number',
        'status',
        'address',
        'updated_at',
        'created_at',
      ],
      where,
    });
    const { ...rest } = customer;
    return new SingleCustomerDto({
      ...rest,
      created_at: customer.created_at.getTime(),
      updated_at: customer.updated_at.getTime(),
      updated_by: '',
    });
  }

  async updateCustomer(
    id: string,
    data: CustomerRequestDto,
  ): Promise<SingleCustomerDto> {
    try {
      if (data.email && data.email !== '') {
        if (!emailRegex.test(data.email)) {
          throw [
            {
              field: 'email',
              message: 'Email is not a valid email address.',
            },
          ];
        }
      }
      await this.customerRep.update(id, data);
      const savedCustomer = await this.customerRep.findOne({
        select: [
          '_id',
          'name',
          'city',
          'email',
          'mobile_number',
          'status',
          'updated_at',
          'created_at',
          'address',
        ],
        where: { _id: id },
      });
      const { ...rest } = savedCustomer;
      return new SingleCustomerDto({
        ...rest,
        created_at: savedCustomer.created_at.getTime(),
        updated_at: savedCustomer.updated_at.getTime(),
        updated_by: '',
      });
    } catch (err) {
      throw err;
    }
  }

  async addCustomer(data: CustomerRequestDto): Promise<SingleCustomerDto> {
    try {
      if (data.email && data.email !== '') {
        if (!emailRegex.test(data.email)) {
          throw [
            {
              field: 'email',
              message: 'Email is not a valid email address.',
            },
          ];
        }
      }
      const customer = await this.customerRep.save(data);
      const { ...rest } = customer;
      return new SingleCustomerDto({
        ...rest,
        created_at: customer.created_at.getTime(),
        updated_at: customer.updated_at.getTime(),
        updated_by: '',
      });
    } catch (err) {
      throw err;
    }
  }

  async deleteCustomer(id: any): Promise<any> {
    try {
      return await this.customerRep.softDelete(id);
    } catch (err) {
      return err;
    }
  }
}
