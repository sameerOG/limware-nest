import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/baseService';
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
  private departmentRep: BaseService<Department>;
  private labRep: BaseService<Laboratory>;

  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Laboratory)
    private labRepRepository: Repository<Laboratory>,
  ) {
    this.departmentRep = new BaseService<Department>(this.departmentRepository);
    this.labRep = new BaseService<Laboratory>(this.labRepRepository);
  }

  async getAll(
    facility_id: string,
    parent_id: string,
  ): Promise<DepartmentDto[]> {
    const departments = await this.departmentRep.findAll({
      where: {
        facility_id: { _id: facility_id },
        parent_id: { _id: parent_id },
      },
      relations: ['parent_id', 'facility_id'],
    });

    return departments.map(
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
        facility_id: facility_id?._id, // Convert facility_id to string
        parent,
        parent_id: parent_id?._id, // Convert parent_id to string
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
    const departments = await this.departmentRep.findAll({
      where: {
        facility_id: { _id: user.facility_id },
      },
      skip: skip,
      take: take,
      order: transformSortField(sort),
    });

    return departments;
  }

  async getLabDepartments(user): Promise<Department[]> {
    const labModel = await this.labRep.findOne({
      where: {
        facility_id: {
          _id: user.facility_id,
        },
      },
    });
    const departments = await this.departmentRep.findAll({
      where: {
        parent: 'laboratory',
        parent_id: {
          _id: labModel?._id,
        },
      },
    });

    return departments;
  }

  async getByFacility(facility_id: string): Promise<Department[]> {
    return await this.departmentRep.findAll({
      where: {
        facility_id: {
          _id: facility_id,
        },
      },
    });
  }

  async getSingle(_id: string): Promise<DepartmentDto> {
    const data: any = await this.departmentRep.findOne({
      where: {
        _id,
      },
      relations: ['parent_id', 'facility_id'],
    });
    return new DepartmentDto(data);
  }

  async add(body: DepartmentRequest, user): Promise<DepartmentDto> {
    const department: any = { ...body };
    if (!department.facility_id) {
      const labModel = await this.labRep.findOne({
        where: {
          facility_id: {
            _id: user.facility_id,
          },
        },
      });
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
