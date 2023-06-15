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
import { emailRegex } from 'src/common/helper/enums';

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
  ) {}

  async getUsers(
    user,
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
      relations: ['facility_id'],
      where,
      skip,
      take,
      order: transformSortField(sort),
    });
    let filterUsers;
    if (user.portal === 'limware') {
      filterUsers = users.filter((info) => {
        return info.facility_id?._id == user.facility_id;
      });
    } else {
      filterUsers = users;
    }

    return filterUsers;
  }

  async reLoggedInUserPermissions(user): Promise<any> {
    if (user.isSsuperUser === 0 && user.portal === 'limware') {
      console.log('before');
      const employee = await this.empRep
        .createQueryBuilder('employee')
        .select('employee.*')
        .where('employee.user_id = :user_id', { user_id: user._id })
        .getRawOne();

      const employeeFacility = await this.empFacilityRep
        .createQueryBuilder('employee_facility')
        .select('employee_facility.*')
        .where('employee_facility.employee_id = :employee_id', {
          employee_id: employee._id,
        })
        .andWhere('employee_facility.facility_id = :facility_id', {
          facility_id: user.facility_id,
        })
        .getRawOne();

      const permissions = [];
      const role_ids = employeeFacility.role_ids
        ? employeeFacility.role_ids
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
      const user = await this.usersRep.findOne({
        where: [
          {
            mobile_number: data.mobile_number,
          },
          {
            username: data.username,
          },
        ],
      });
      if (user) {
        if (user._id !== id) {
          // Another user already has the same username or mobile_number
          const errors = [];

          if (user.username === data.username) {
            errors.push({
              field: 'username',
              message: `Username ${data.username} has already been taken.`,
            });
          }

          if (user.mobile_number === data.mobile_number) {
            errors.push({
              field: 'mobile_number',
              message: `Mobile Number ${data.mobile_number} has already been taken.`,
            });
          }

          if (errors.length > 0) {
            throw errors;
          }
        }
      }
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
      throw err;
    }
  }

  async addUser(data: UserRequestDto): Promise<SingleUserDto> {
    try {
      if (data.email === '') {
        delete data.email;
      } else {
        if (!emailRegex.test(data.email)) {
          throw [
            {
              field: 'email',
              message: 'Email is not a valid email address.',
            },
          ];
        }
      }

      if (data.portal == 'administration') {
        Object.assign(data, { isSuperUser: 1 });
      }
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
      throw err;
    }
  }

  async addFacilityUser(data: any, loggedInUser): Promise<SingleUserDto> {
    try {
      if (data.email === '') {
        delete data.email;
      } else {
        if (!emailRegex.test(data.email)) {
          throw [
            {
              field: 'email',
              message: 'Email is not a valid email address.',
            },
          ];
        }
      }
      const savedUser = await this.usersRep.findOne({
        where: [
          { username: data.username },
          { mobile_number: data.mobile_number },
        ],
        relations: ['customer_id', 'facility_id', 'employee_id'],
      });
      if (savedUser) {
        if (
          savedUser.username === data.username &&
          savedUser.mobile_number === data.mobile_number
        ) {
          throw [
            {
              field: 'username',
              message: `Username ${data.username} has already been taken.`,
            },
            {
              field: 'mobile_number',
              message: `Mobile Number ${data.mobile_number} has already been taken.`,
            },
          ];
        } else if (savedUser.username === data.username) {
          // Only username matches
          throw [
            {
              field: 'username',
              message: `Username ${data.username} has already been taken.`,
            },
          ];
        } else if (savedUser.mobile_number === data.mobile_number) {
          // Only mobile_number matches
          throw [
            {
              field: 'mobile_number',
              message: `Mobile Number ${data.mobile_number} has already been taken.`,
            },
          ];
        }
      } else {
        const hashed = await bcrypt.hashSync(data.password, SALT_ROUNDS);
        data.password = hashed;
        data.password_hash = hashed;
        if (data?.portal === 'limware' || loggedInUser.portal === 'limware') {
          data.customer_id = data?.customer_id;
          data.facility_id = data.facility_id;
        }
        const user = await this.usersRep.save(data);
        if (user) {
          const employeeModel = await this.empRep.findOne({
            where: { _id: user.employee_id },
          });
          const { full_name, email, mobile_number, status, address, city } =
            user;
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
      }
    } catch (err) {
      console.log('err', err);
      throw err;
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
