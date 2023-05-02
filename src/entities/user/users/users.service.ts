import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UserRequestDto } from '../dto/request.dto';
import { SingleUserDto, UserDto } from '../dto/response.dto';
import { Users } from '../user.entity';
import * as bcrypt from 'bcryptjs';
import { EmployeeFacility } from 'src/entities/employee/employee_facility.entity';
import { Role } from 'src/entities/role/role.entity';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRep: Repository<Users>,
    @InjectRepository(EmployeeFacility)
    private empFacilityRep: Repository<EmployeeFacility>,
    @InjectRepository(Role) private rolesRep: Repository<Role>,
  ) {}

  async getUsers(
    skip: number,
    take: number,
    text?: string,
  ): Promise<UserDto[]> {
    let where: any = {}; // Declare an empty where object

    if (text) {
      where.full_name = Like(`%${text}%`);
    }
    const users = await this.usersRep.find({
      select: ['_id', 'full_name', 'email', 'portal', 'status', 'username'],
      where,
      skip,
      take,
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
    console.log('before');
    const users = await this.usersRep
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.user_mapping', 'user_mapping')
      .where('user_mapping.laboratory_id = :laboratory_id', {
        laboratory_id: id,
      })
      .getRawMany();
    users.map((user) => {
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

  async deleteUser(id: any): Promise<any> {
    try {
      return await this.usersRep.softDelete(id);
    } catch (err) {
      return err;
    }
  }
}
