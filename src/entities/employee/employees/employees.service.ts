import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { EmployeeRequestDto } from '../dto/request.dto';
import { EmployeeResponseDto } from '../dto/response.dto';
import { Employee } from '../employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private empRep: Repository<Employee>,
  ) {}

  async getAllByFacility(facility_id: string): Promise<EmployeeResponseDto[]> {
    const data = await this.empRep
      .createQueryBuilder('employee')
      .select('employee.*')
      .where('employee.facility_id = :facility_id', { facility_id })
      .getRawMany();
    data.forEach((item) => {
      const { ...rest } = item;
      item = new EmployeeResponseDto({
        ...rest,
        created_at: item.created_at.getTime(),
        updated_at: item.updated_at.getTime(),
        updated_by: '',
      });
    });
    return data;
  }

  async getAll(
    skip: number,
    take: number,
    text?: string,
  ): Promise<EmployeeResponseDto[]> {
    let query = this.empRep
      .createQueryBuilder('employee')
      .select('employee.*')
      .skip(skip)
      .take(take);

    if (text) {
      query = query.where('employee.name LIKE :name', { name: `%${text}%` });
    }

    const data = await query.getRawMany();

    data.forEach((item) => {
      const { ...rest } = item;
      item = new EmployeeResponseDto({
        ...rest,
        created_at: item.created_at.getTime(),
        updated_at: item.updated_at.getTime(),
        updated_by: '',
      });
    });

    return data;
  }

  async getSingle(id: string): Promise<EmployeeResponseDto> {
    const data = await this.empRep.findOne({
      select: [
        '_id',
        'address',
        'city',
        'cnic',
        'created_at',
        'updated_at',
        'email',
        'gender',
        'mobile_number',
        'name',
        'status',
      ],
      relations: ['customer_id', 'facility_id'],
      where: { _id: id },
    });
    const { ...rest } = data;
    return new EmployeeResponseDto({
      ...rest,
      customer_id: data.customer_id._id,
      facility_id: data.facility_id._id,
      facility: data.facility_id,
      created_at: data.created_at?.getTime(),
      updated_at: data.updated_at?.getTime(),
      updated_by: '',
    });
  }

  async add(body: EmployeeRequestDto): Promise<EmployeeResponseDto> {
    const data = await this.empRep.save(body);
    const { ...rest } = data;
    return new EmployeeResponseDto({
      ...rest,
      created_at: data.created_at.getTime(),
      updated_at: data.updated_at.getTime(),
      updated_by: '',
    });
  }

  async update(
    id: string,
    body: EmployeeRequestDto,
  ): Promise<EmployeeResponseDto> {
    try {
      await this.empRep.update(id, body);
      const data = await this.empRep.findOne({
        select: [
          '_id',
          'address',
          'city',
          'cnic',
          'created_at',
          'updated_at',
          'email',
          'gender',
          'mobile_number',
          'name',
          'status',
        ],
        relations: ['customer_id', 'facility_id'],
        where: { _id: id },
      });
      const { ...rest } = data;
      return new EmployeeResponseDto({
        ...rest,
        customer_id: data.customer_id._id,
        facility_id: data.facility_id._id,
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
      return await this.empRep.softDelete(id);
    } catch (err) {
      return err;
    }
  }
}
