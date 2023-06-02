import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transformSortField } from 'src/common/utils/transform-sorting';
import { Department } from 'src/entities/department/department.entity';
import { Facility } from 'src/entities/Facility/facility.entity';
import { Role } from 'src/entities/role/role.entity';
import { Brackets, Like, Repository } from 'typeorm';
import {
  AssignFacilityRequestDto,
  EmployeeRequestDto,
} from '../dto/request.dto';
import { EmployeeResponseDto } from '../dto/response.dto';
import { Employee } from '../employee.entity';
import { EmployeeFacility } from '../employee_facility.entity';
import { EmployeeFacilityDepartment } from '../employee_facility_department.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private empRep: Repository<Employee>,
    @InjectRepository(Facility)
    private facilityRep: Repository<Facility>,
    @InjectRepository(EmployeeFacility)
    private empFacilityRep: Repository<EmployeeFacility>,
    @InjectRepository(EmployeeFacilityDepartment)
    private empFacilityDepartmentRep: Repository<EmployeeFacilityDepartment>,
    @InjectRepository(Role)
    private rolesRep: Repository<Role>,
    @InjectRepository(Department)
    private departmentRep: Repository<Department>,
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
    user,
    skip: number,
    take: number,
    text?: string,
    sort?: string,
  ): Promise<EmployeeResponseDto[]> {
    let query;

    if (user.portal === 'limware') {
      query = this.empRep
        .createQueryBuilder('employee')
        .select('employee.*')
        .where('employee.facility_id = :facility_id', {
          facility_id: user.facility_id,
        })
        .skip(skip)
        .take(take)
        .orderBy(transformSortField(sort));
    } else {
      query = this.empRep
        .createQueryBuilder('employee')
        .select('employee.*')
        .skip(skip)
        .take(take)
        .orderBy(transformSortField(sort));
    }

    if (text) {
      query = query.where(
        new Brackets((qb) => {
          qb.where('employee.name LIKE :name', { name: `%${text}%` })
            .orWhere('employee.mobile_number LIKE :mobile_number', {
              mobile_number: `%${text}%`,
            })
            .orWhere('employee.city LIKE :city', { city: `%${text}%` });
          // Add more OR conditions for other fields as needed
        }),
      );
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
      relations: ['customer_id', 'facility_id', 'user_id'],
      where: { _id: id },
    });
    const { ...rest } = data;
    return new EmployeeResponseDto({
      ...rest,
      customer_id: data.customer_id._id,
      customer: data.customer_id,
      user: data.user_id,
      facility_id: data.facility_id._id,
      facility: data.facility_id,
      created_at: data.created_at?.getTime(),
      updated_at: data.updated_at?.getTime(),
      updated_by: '',
    });
  }

  async getByEmployee(id: string): Promise<any> {
    let result = [];
    const data = await this.empFacilityRep
      .createQueryBuilder('employee_facility')
      .select('employee_facility.*')
      .where('employee_facility.employee_id = :employee_id', {
        employee_id: id,
      })
      .getRawMany();

    for (let i = 0; i < data.length; i++) {
      const facility = await this.facilityRep
        .createQueryBuilder('facility')
        .select('facility.*')
        .where('facility._id = :_id', { _id: data[i].facility_id })
        .getRawOne();

      let obj = {
        employee_id: data[i].employee_id,
        facility_id: data[i].facility_id,
        facility,
        _id: id,
      };

      const roles = data[i].role_ids;
      const rolesData = [];
      for (let j = 0; j < roles.length; j++) {
        let role = await this.rolesRep.findOne({ where: { _id: roles[j] } });
        rolesData.push(role);
      }
      Object.assign(obj, { roles: rolesData });

      const departments = await this.empFacilityDepartmentRep
        .createQueryBuilder('employee_facility_department')
        .select('employee_facility_department.*')
        .where(
          'employee_facility_department.employee_facility_id = :employee_facility_id',
          { employee_facility_id: data[i]._id },
        )
        .getRawMany();

      let savedDepartments = [];
      for (let k = 0; k < departments.length; k++) {
        const department = await this.departmentRep.findOne({
          where: { _id: departments[i].department_id },
          relations: ['parent_id'],
        });
        let departmentData = {
          created_at: departments[k].created_at.getTime(),
          description: department.description || '',
          facility_id: { $oid: departments[k].facility_id },
          name: department.name,
          parent: department.parent,
          parent_id: { $oid: department.parent_id._id },
          updated_at: departments[k].updated_at.getTime(),
          _id: { $oid: departments[k].department_id },
        };
        savedDepartments.push(departmentData);
      }
      Object.assign(obj, { departments: savedDepartments });
      result.push(obj);
    }

    return result;
  }

  async assignFacility(
    body: AssignFacilityRequestDto,
    id?: string,
  ): Promise<any> {
    let empFacility = new EmployeeFacility();
    if (id) {
      empFacility = await this.empFacilityRep
        .createQueryBuilder('employee_facility')
        .select('employee_facility.*')
        .where('employee_facility.employee_id = :employee_id', {
          employee_id: id,
        })
        .getRawOne();
    }
    const { departments, employee_id, facility_id, role_ids } = body;
    const employee = await this.empRep.findOne({ where: { _id: employee_id } });
    empFacility.employee_id = employee;
    empFacility.facility_id = facility_id;
    empFacility.role_ids = role_ids;

    let data;
    if (id) {
      await this.empFacilityRep
        .createQueryBuilder()
        .update(EmployeeFacility)
        .set(empFacility)
        .where('employee_id = :employee_id', { employee_id: id })
        .execute();
      data = await this.empFacilityRep
        .createQueryBuilder('employee_facility')
        .select('employee_facility.*')
        .where('employee_facility.employee_id = :employee_id', {
          employee_id: id,
        })
        .getRawOne();
    } else {
      data = await this.empFacilityRep.save(empFacility);
    }
    if (data) {
      if (id) {
        await this.empFacilityDepartmentRep
          .createQueryBuilder('employee_facility_department')
          .delete()
          .from(EmployeeFacilityDepartment)
          .where('employee_facility_id = :employee_facility_id', {
            employee_facility_id: empFacility._id,
          })
          .execute();
      }

      departments.forEach(async (department) => {
        const empFacilityDep = new EmployeeFacilityDepartment();
        empFacilityDep.employee_id = employee_id;
        empFacilityDep.facility_id = facility_id;
        empFacilityDep.employee_facility_id = data._id;
        empFacilityDep.department_id = department;
        await this.empFacilityDepartmentRep.save(empFacilityDep);
      });
    }
    return data;
  }

  async getUnassignedFacilities(id: string, user): Promise<any> {
    let employeeModel;
    if (user.portal === 'limware') {
      employeeModel = await this.empRep
        .createQueryBuilder('employee')
        .select('employee.*')
        .where('employee._id = :_id', { _id: id })
        .andWhere('employee.customer_id = :customer_id', {
          customer_id: user.customer_id,
        })
        .andWhere('employee.facility_id = :facility_id', {
          facility_id: user.facility_id,
        })
        .getRawOne();
    } else {
      employeeModel = await this.empRep
        .createQueryBuilder('employee')
        .select('employee.*')
        .where('employee._id = :_id', { _id: id })
        .getRawOne();
    }

    if (employeeModel) {
      let facility = await this.facilityRep
        .createQueryBuilder('facility')
        .select('facility.*')
        .where('facility._id = :_id', { _id: employeeModel.facility_id })
        .getRawOne();

      let parentFacility = await this.facilityRep
        .createQueryBuilder('facility')
        .select('facility.*')
        .where('facility.parent_facility_id = :parent_facility_id', {
          parent_facility_id: facility.parent_facility_id,
        })
        .getRawOne();
      let parent_facility_id = '';
      if (parentFacility) {
        parent_facility_id = parentFacility._id;
      } else {
        parent_facility_id = facility._id;
      }

      let allFacilities = await this.facilityRep
        .createQueryBuilder('facility')
        .select('facility.*')
        .where('facility._id = :_id', { _id: parent_facility_id })
        .orWhere('facility.parent_facility_id = :parent_facility_id', {
          parent_facility_id,
        })
        .getRawMany();

      let assignedFacilities = await this.empFacilityRep
        .createQueryBuilder('employee_facility')
        .select('employee_facility.*')
        .where('employee_facility.employee_id = :employee_id', {
          employee_id: id,
        })
        .getRawMany();

      let returnResult = [];
      allFacilities.forEach((f) => {
        let alreadyMapped = false;
        assignedFacilities.forEach((af) => {
          if (f._id === af.facility_id) {
            alreadyMapped = true;
          }
        });
        if (!alreadyMapped) {
          returnResult.push(f);
        }
      });
      return returnResult;
    }
  }

  async getEmployeeFacilities(id: string, user): Promise<any> {
    const empFacility = await this.empFacilityRep
      .createQueryBuilder('employee_facility')
      .select('employee_facility.*')
      .where('employee_facility.employee_id = :employee_id', {
        employee_id: id,
      })
      .getRawOne();

    const facility = await this.facilityRep
      .createQueryBuilder('facility')
      .select('facility.*')
      .where('facility._id = :_id', { _id: empFacility.facility_id })
      .getRawOne();

    const empFacilityDepartments = await this.empFacilityDepartmentRep
      .createQueryBuilder('employee_facility_department')
      .select('employee_facility_department.*')
      .where(
        'employee_facility_department.employee_facility_id = :employee_facility_id',
        { employee_facility_id: empFacility._id },
      )
      .getRawMany();

    let result = {
      employee_id: empFacility.employee_id,
      facility_id: empFacility.facility_id,
      role_ids: empFacility.role_ids,
      updated_at: empFacility.updated_at.getTime(),
      created_at: empFacility.created_at.getTime(),
      created_by: user._id,
      updated_by: user._id,
      facility,
      departmentMappings: empFacilityDepartments,
      _id: id,
    };

    return result;
  }

  async deleteEmployeeFacilities(id: string): Promise<void> {
    const empFacility = await this.empFacilityRep
      .createQueryBuilder('employee_facility')
      .select('employee_facility.*')
      .where('employee_facility.employee_id = :employee_id', {
        employee_id: id,
      })
      .getRawOne();

    await this.empFacilityDepartmentRep
      .createQueryBuilder('employee_facility_department')
      .delete()
      .from(EmployeeFacilityDepartment)
      .where('employee_facility_id = :employee_facility_id', {
        employee_facility_id: empFacility._id,
      })
      .execute();

    await this.empFacilityRep.delete(empFacility._id);
  }

  async add(body: EmployeeRequestDto, user): Promise<EmployeeResponseDto> {
    if (!body.facility_id) {
      Object.assign(body, {
        facility_id: user.facility_id,
        customer_id: user.customer_id,
      });
    }
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
