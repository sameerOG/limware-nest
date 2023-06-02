import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { FacilityUserRequestDto, UserRequestDto } from '../dto/request.dto';
import {
  SingleFacilityUserDto,
  SingleUserDto,
  UserDto,
} from '../dto/response.dto';
import { Users } from '../user.entity';
import * as bcrypt from 'bcryptjs';
import { EmployeeFacility } from 'src/entities/employee/employee_facility.entity';
import { Role } from 'src/entities/role/role.entity';
import { Employee } from 'src/entities/employee/employee.entity';
import { transformSortField } from 'src/common/utils/transform-sorting';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRep: Repository<Users>,
    @InjectRepository(EmployeeFacility)
    private empFacilityRep: Repository<EmployeeFacility>,
    @InjectRepository(Role) private rolesRep: Repository<Role>,
    @InjectRepository(Employee) private empRep: Repository<Employee>,
    @InjectRepository(Laboratory) private labRep: Repository<Laboratory>,
  ) { }

  async getUsers(
    skip: number,
    take: number,
    text?: string,
    sort?: string,
  ): Promise<UserDto[]> {
    let where: any = {}; // Declare an empty where object

    if (text) {
      where = [
        { full_name: Like(`%${text}%`) },
        { username: Like(`%${text}%`) },
        { email: Like(`%${text}%`) },
        { portal: Like(`%${text}%`) },
      ];
    }
    const users = await this.usersRep.find({
      select: ['_id', 'full_name', 'email', 'portal', 'status', 'username'],
      where,
      skip,
      take,
      order: transformSortField(sort),
    });
    return users;
  }

  async reLoggedInUserPermissions(user): Promise<any> {
    if (user.isSuperUser === 0 && user.portal === 'limware') {
      const employeeFacility = await this.empFacilityRep
        .createQueryBuilder('employee_facility')
        .select('employee_facility.*')
        .where('employee_facility.employee_id = :employee_id', {
          employee_id: user.employee_id,
        })
        .andWhere('employee_facility.facility_id = :facility_id', {
          facility_id: user.facility_id,
        })
        .getRawOne();

      const permissions = [];
      const role_ids = employeeFacility.role_ids
        ? JSON.parse(employeeFacility.role_ids)
        : [];
      for (let i = 0; i < role_ids.length; i++) {
        const role = await this.rolesRep.findOne({
          where: { _id: role_ids[i] },
        });
        if (role.permissions) {
          permissions.push(role.permissions);
        }
      }
      return permissions;
    }
    return null;
  }

  async _getEmployeeFacilities(facility_id: string) {
    let employeeFacilities = [];
    let assignedFacilities = await this.empFacilityRep
      .createQueryBuilder('employee_facility')
      .select('employee_facility.*')
      .where('employee_facility.facility_id = :facility_id', { facility_id })
      .getRawMany();
    for (let i = 0; i < assignedFacilities.length; i++) {
      let employeeFacility = assignedFacilities[i];
      for (let j = 0; j < employeeFacility.role_ids?.length; j++) {
        let role = await this.rolesRep.findOne({
          where: { _id: employeeFacility.role_ids[j] },
        });
        if (role.permissions) {
          employeeFacilities = [...employeeFacilities, ...role.permissions];
        }
      }
    }
    return employeeFacilities;
  }

  async getUser(id: string): Promise<SingleUserDto> {
    const user = await this.usersRep.findOne({
      select: [
        '_id',
        'full_name',
        'email',
        'portal',
        'status',
        'username',
        'address',
        'auth_key',
        'isSuperUser',
        'mobile_number',
        'password_hash',
        'city',
        'contact_numbers',
        'created_at',
      ],
      where: { _id: id },
    });
    const { ...rest } = user;
    return new SingleUserDto({
      ...rest,
      contact_numbers: user.contact_numbers,
      created_at: user.created_at.getTime(), // set created_at field as timestamp
    });
  }

  async getLabUsers(id: string): Promise<SingleUserDto[]> {
    const lab = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory._id = :_id', { _id: id })
      .getRawOne();

    const users = await this.usersRep
      .createQueryBuilder('user')
      .select('"user".*,lab._id as laboratory_id')
      .leftJoin('facility', 'f', 'f._id = user.facility_id')
      .leftJoin('laboratory', 'lab', 'lab.facility_id = f._id')
      .where('"user".facility_id = :facility_id', {
        facility_id: lab.facility_id,
      })
      .getRawMany();

    users.map((user) => {
      const id = {
        $oid: user._id,
      };
      delete user._id;
      Object.assign(user, { _id: id });
      const { ...rest } = user;
      return new SingleUserDto({
        ...rest,
        contact_numbers: user.contact_numbers,
        created_at: user.created_at.getTime(), // set created_at field as timestamp
      });
    });
    return users;
  }

  async updateUser(id: string, data: UserRequestDto): Promise<SingleUserDto> {
    try {
      await this.usersRep.update(id, data);
      const savedUser = await this.usersRep.findOne({
        select: [
          '_id',
          'full_name',
          'email',
          'portal',
          'status',
          'username',
          'address',
          'auth_key',
          'isSuperUser',
          'mobile_number',
          'password_hash',
          'city',
          'contact_numbers',
          'created_at',
        ],
        where: { _id: id },
      });
      const { ...rest } = savedUser;
      return new SingleUserDto({
        ...rest,
        contact_numbers: savedUser.contact_numbers,
        created_at: savedUser.created_at.getTime(), // set created_at field as timestamp
      });
    } catch (err) {
      return err;
    }
  }

  async addUser(data: UserRequestDto): Promise<SingleUserDto> {
    try {
      const hashed = await bcrypt.hashSync(data.password, SALT_ROUNDS);
      data.password = hashed;
      data.password_hash = hashed;
      const user = await this.usersRep.save(data);
      const { ...rest } = user;
      return new SingleUserDto({
        ...rest,
        created_at: user.created_at.getTime(), // set created_at field as timestamp
      });
    } catch (err) {
      return err;
    }
  }

  async addFacilityUser(data: any, loggedInUser): Promise<SingleUserDto> {
    try {
      const savedUser = await this.usersRep.findOne({
        where: { _id: loggedInUser._id },
        relations: ['customer_id', 'facility_id', 'employee_id'],
      });
      const hashed = await bcrypt.hashSync(data.password, SALT_ROUNDS);
      data.password = hashed;
      data.password_hash = hashed;
      if (savedUser?.portal === 'limware') {
        data.customer_id = savedUser?.customer_id;
        data.facility_id = savedUser.facility_id;
      }
      const user = await this.usersRep.save(data);
      if (user) {
        const employeeModel = await this.empRep.findOne({
          where: { _id: user.employee_id },
        });
        const { full_name, email, mobile_number, status, address, city } = user;
        employeeModel.user_id = user;
        employeeModel.name = full_name;
        employeeModel.email = email;
        employeeModel.mobile_number = mobile_number;
        employeeModel.status = status;
        employeeModel.address = address;
        employeeModel.city = city;
        await this.empRep.update(employeeModel._id, employeeModel);
      }
      const { ...rest } = user;
      return new SingleFacilityUserDto({
        ...rest,
        created_at: user.created_at.getTime(),
      });
    } catch (err) {
      console.log('err', err);
      return err;
    }
  }

  async deleteUser(id: any): Promise<any> {
    try {
      return await this.usersRep.softDelete(id);
    } catch (err) {
      return err;
    }
  }
}
