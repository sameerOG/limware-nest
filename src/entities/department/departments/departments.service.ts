import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transformSortField } from 'src/common/utils/transform-sorting';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { Repository } from 'typeorm';
import { Department } from '../department.entity';
import {
  DepartmentRequest,
  EditDepartmentRequest,
  findAllDepartmentsResponseDto,
} from '../dto/request.dto';
import { DepartmentDto } from '../dto/response.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentRep: Repository<Department>,
    @InjectRepository(Laboratory)
    private labRep: Repository<Laboratory>,
  ) {}

  async getAll(
    facility_id: string,
    parent_id: string,
  ): Promise<DepartmentDto[]> {
    const where: any = facility_id && { facility_id: facility_id };
    const data = await this.departmentRep
      .createQueryBuilder('department')
      .select('department.*')
      .where('department.facility_id = :facility_id', { facility_id })
      .andWhere('department.parent_id = :parent_id', { parent_id })
      .getRawMany();
    return data.map(
      ({
        _id,
        name,
        description,
        facility_id,
        parent,
        parent_id,
        created_at,
        updated_at,
      }) => ({
        _id: _id,
        name,
        description,
        facility_id,
        parent,
        parent_id,
        created_at: created_at.getTime(),
        updated_at: updated_at.getTime(),
        updated_by: '',
      }),
    );
  }

  async findAll(
    user,
    skip: number,
    take: number,
    sort?: string,
  ): Promise<findAllDepartmentsResponseDto[]> {
    const departments = await this.departmentRep
      .createQueryBuilder('department')
      .select('department.*')
      .where('department.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .skip(skip)
      .take(take)
      .orderBy(transformSortField(sort))
      .getRawMany();

    return departments;
  }

  async getLabDepartments(user): Promise<Department[]> {
    const labModel = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();
    const departments = await this.departmentRep
      .createQueryBuilder('department')
      .select('department.*')
      .where('department.parent = :parent', {
        parent: 'laboratory',
      })
      .andWhere('department.parent_id = :parent_id', {
        parent_id: labModel?._id,
      })
      .getRawMany();

    return departments;
  }

  async getByFacility(facility_id: string): Promise<Department[]> {
    return await this.departmentRep
      .createQueryBuilder('department')
      .select('department.*')
      .where('department.facility_id = :facility_id', { facility_id })
      .getRawMany();
  }

  async getSingle(_id: string): Promise<DepartmentDto> {
    const data: any = await this.departmentRep
      .createQueryBuilder('department')
      .select('department.*')
      .where('department._id = :_id', { _id })
      .getRawOne();
    return new DepartmentDto(data);
  }

  async add(body: DepartmentRequest, user): Promise<DepartmentDto> {
    const department: any = { ...body };
    if (!department.facility_id) {
      const labModel = await this.labRep
        .createQueryBuilder('laboratory')
        .select('laboratory.*')
        .where('laboratory.facility_id = :facility_id', {
          facility_id: user.facility_id,
        })
        .getRawOne();
      Object.assign(department, {
        facility_id: user.facility_id,
        parent: 'laboratory',
        parent_id: labModel?._id,
      });
    }
    const data = await this.departmentRep.save(department);
    const { ...rest } = data;
    return new DepartmentDto({
      ...rest,
      created_at: data.created_at.getTime(),
      updated_at: data.updated_at.getTime(),
      updated_by: '',
      facility_id: body.facility_id,
      parent_id: body.parent_id,
    });
  }

  async update(
    id: string,
    body: EditDepartmentRequest,
  ): Promise<DepartmentDto> {
    try {
      const department: any = { ...body };
      await this.departmentRep.update(id, department);
      const data = await this.departmentRep.findOne({
        relations: ['facility_id,parent_id'],
        where: { _id: id },
      });
      const { ...rest } = data;
      return new DepartmentDto({
        ...rest,
        created_at: data.created_at?.getTime(),
        updated_at: data.updated_at?.getTime(),
        updated_by: '',
        facility_id: data.facility_id._id,
        parent_id: data.parent_id._id,
      });
    } catch (err) {
      return err;
    }
  }

  async delete(id: string): Promise<any> {
    try {
      return await this.departmentRep.softDelete(id);
    } catch (err) {
      return err;
    }
  }
}
