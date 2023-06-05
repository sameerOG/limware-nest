import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../user/user.entity';
import {
  AuthRequest,
  ChangePasswordRequest,
  CreateUserRequestDto,
  LoginIntoFacility,
  RegisterRequest,
  ValidateOtpRequest,
} from './dto/request.dto';
import { AuthDto, AuthRegisterDto, ProfileResponse } from './dto/response.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserAccessToken } from '../user_access_token/user_access_token.entity';
import { Customers } from '../customer/customer.entity';
import { Facility } from '../Facility/facility.entity';
import { Laboratory } from '../laboratory/laboratory.entity';
import { Employee } from '../employee/employee.entity';
import ShortUniqueId from 'short-unique-id';
import axios from 'axios';
import { Error } from 'src/common/global-dto.dto';
import { SingleUserDto } from '../user/dto/response.dto';
import { EmployeeFacility } from '../employee/employee_facility.entity';
import { EmployeeFacilityDepartment } from '../employee/employee_facility_department.entity';
import { Role } from '../role/role.entity';
import { Department } from '../department/department.entity';
import { UserRole } from '../user_role/user_role.entity';

const uid = new ShortUniqueId({ length: 6, dictionary: 'number' });
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private userRep: Repository<Users>,
    @InjectRepository(UserAccessToken)
    private userTokenRep: Repository<UserAccessToken>,
    @InjectRepository(Customers)
    private customerRep: Repository<Customers>,
    @InjectRepository(Facility)
    private facilityRep: Repository<Facility>,
    @InjectRepository(Laboratory)
    private labRep: Repository<Laboratory>,
    @InjectRepository(Employee)
    private empRep: Repository<Employee>,
    @InjectRepository(Role)
    private roleRep: Repository<Role>,
    @InjectRepository(Department)
    private departmentRep: Repository<Department>,
    @InjectRepository(EmployeeFacility)
    private empFacilityRep: Repository<EmployeeFacility>,
    @InjectRepository(EmployeeFacilityDepartment)
    private empFacilityDepartment: Repository<EmployeeFacilityDepartment>,
    @InjectRepository(UserRole)
    private userRoleRep: Repository<UserRole>,
  ) {}

  async login(body: AuthRequest): Promise<AuthDto | Error[]> {
    const username = body.username.replace(/-/g, '');
    const user = await this.userRep
      .createQueryBuilder('u')
      .select('u.*, JSON_AGG(f.*) as facilities')
      .leftJoin('facility', 'f', 'f._id = u.facility_id')
      .where(
        'u.email = :email OR u.username = :username OR u.mobile_number = :mobile_number',
        {
          email: username,
          username: username,
          mobile_number: username,
        },
      )
      .andWhere('u.status = :status', { status: 1 })
      .groupBy('u._id')
      .getRawOne();

    const facilities = [];
    user.facilities?.map(async (facility) => {
      if (facility) {
        const { name, type, _id, unique_id } = facility;
        let obj = {
          name,
          unique_id,
          type,
          permissions: [],
          _id: {
            $oid: _id,
          },
        };
        if (user.portal === 'administration') {
          obj.permissions = await this._getAssignedPermissions_AdminPortal(
            user,
          );
        } else if (user.portal === 'limware') {
          if (user.facility_id) {
            obj.permissions = await this._getEmployeeFacilities(
              user.facility_id,
            );
          }
        }
        facilities.push(obj);
      }
    });
    if (user) {
      const authenticated = await bcrypt.compare(
        body.password,
        user['password'],
      );

      const employee = await this.empRep
        .createQueryBuilder('employee')
        .select('employee.*')
        .where('employee.user_id = :user_id', { user_id: user._id })
        .getRawOne();

      if (authenticated) {
        const {
          email,
          full_name,
          isSuperUser,
          portal,
          status,
          username,
          facility_id,
          customer_id,
          _id,
        } = user;
        const obj: any = {
          email,
          full_name,
          is_super_user: isSuperUser,
          portal,
          status: status === 1 ? true : false,
          user_name: username,
          permissions: null,
          facility_id,
          employee_id: employee?._id,
          customer_id,
          user_id: {
            $oid: user._id,
          },
          _id,
        };
        console.log('login obj', obj);
        const token = jwt.sign(obj, 'secretOrKey');
        const tokenExists: UserAccessToken = await this.userTokenRep
          .createQueryBuilder('user_access_token')
          .select('user_access_token.*')
          .where('user_access_token.user_id = :user_id', { user_id: user._id })
          .getRawOne();
        if (tokenExists) {
          tokenExists.access_token = token;
          await this.userTokenRep.update(tokenExists._id, tokenExists);
        } else {
          const user_access_token = new UserAccessToken();
          user_access_token.user_id = user;
          user_access_token.access_token = token;
          await this.userTokenRep.save(user_access_token);
        }
        Object.assign(obj, { token });
        if (obj.portal === 'limware') {
          Object.assign(obj, { facilities });
        }
        return obj;
      } else {
        throw [
          { field: 'password', message: 'Incorrect username or password' },
        ];
      }
    } else {
      return [{ field: 'password', message: 'Incorrect username or password' }];
    }
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
        let role = await this.roleRep.findOne({
          where: { _id: employeeFacility.role_ids[j] },
        });

        if (role.permissions) {
          employeeFacilities = [...employeeFacilities, ...role.permissions];
        }
      }
    }

    return employeeFacilities;
  }

  async _getAssignedPermissions_AdminPortal(user) {
    let permissions = [];
    if (!user.isSuperUser) {
      const userRole = await this.userRoleRep
        .createQueryBuilder('user_role')
        .select('user_role.*')
        .where('user_role.user_id = :user_id', { user_id: user._id })
        .getRawOne();

      if (userRole) {
        const role = await this.roleRep.findOne({
          where: { _id: userRole.role_id },
        });
        if (role && role.permissions) {
          permissions = [...permissions, ...role.permissions];
        }
      }
    }
    return permissions;
  }

  async logout(token: string): Promise<boolean> {
    const userToken: any = await this.userTokenRep.findOne({
      where: { access_token: token },
    });
    if (userToken) {
      await this.userTokenRep.delete(userToken._id);
      return true;
    } else {
      return false;
    }
  }

  async getProfile(id: string): Promise<ProfileResponse> {
    const user: Users = await this.userRep.findOne({
      select: [
        'address',
        'city',
        'created_at',
        'email',
        'full_name',
        'mobile_number',
        'password_hash',
        'status',
        'updated_at',
        'username',
        '_id',
        'contact_numbers',
      ],
      where: { _id: id },
    });
    const { ...rest } = user;
    return new ProfileResponse({
      ...rest,
      created_at: user.created_at.getTime(),
      updated_by: id,
      updated_at: user.updated_at.getTime(),
    });
  }

  async updateProfile(body: any, loggedInUser): Promise<ProfileResponse> {
    await this.userRep.update(loggedInUser._id, body);
    const savedUser = await this.userRep.findOne({
      where: { _id: loggedInUser._id },
    });
    const { ...rest } = savedUser;
    return new ProfileResponse({
      ...rest,
      created_at: savedUser.created_at.getTime(),
      updated_by: loggedInUser._id,
      updated_at: savedUser.updated_at.getTime(),
    });
  }

  async getProfileImage(user): Promise<any> {
    const data = await this.userRep.findOne({ where: { _id: user._id } });
    if (data) {
      const imageUrl = `${process.env.BASE_URL}/Uploads/images/${data.profile_image_name}`;
      // const response = await axios.get(imageUrl);
      // console.log('response', response);
      // const imageBuffer = response.data;
      return imageUrl;
    }
  }

  async changePassword(body: ChangePasswordRequest, user): Promise<any> {
    const data = await this.userRep.findOne({ where: { _id: user._id } });
    if (data) {
      const authenticated = await bcrypt.compare(
        body.current_password,
        data['password'],
      );

      if (authenticated) {
        if (body.new_password === body.confirm_password) {
          const hashed = await bcrypt.hashSync(body.new_password, 10);
          data.password = hashed;
          data.password_hash = hashed;
          await this.userRep.update(data._id, data);
          return data;
        } else {
          return null;
        }
      } else {
        throw [
          { field: 'current_password', message: 'Incorrect current password' },
        ];
      }
    }
  }

  async loginIntoFacility(body: LoginIntoFacility): Promise<boolean> {
    const user: any = await this.userRep.findOne({
      where: { _id: body.user_id },
    });
    const userToken: UserAccessToken = await this.userTokenRep
      .createQueryBuilder('user_access_token')
      .select('user_access_token.*')
      .where('user_access_token.user_id = :user_id', { user_id: user._id })
      .getRawOne();
    if (userToken) {
      userToken.access_token = body.token;
      userToken.facility_id = body.facility_id;
      await this.userTokenRep.update(userToken._id, userToken);
      return true;
    } else {
      return false;
    }
  }

  async validateOtp(body: ValidateOtpRequest): Promise<any> {
    const user = await this.userRep.findOne({
      where: [{ _id: body.user_id }, { otp: String(body.otp) }],
    });
    if (user) {
      user.status = 1;
      await this.userRep.update(body.user_id, user);
      return user;
    } else {
      return null;
    }
  }

  async register(body: RegisterRequest): Promise<AuthRegisterDto> {
    const user = await this.userRep.findOne({
      where: [
        { email: body.username },
        { username: body.username },
        { mobile_number: body.username },
      ],
    });
    if (user) {
      throw [{ field: 'username', message: 'User already exists' }];
    } else {
      const customer = await this.createCustomer(body);
      const facility = await this.createFacility(customer, body);
      const lab = await this.createLaboratory(customer, facility, body);
      const employee = await this.createEmployee(customer, facility, body);
      const savedUser = await this.createUser(
        customer,
        facility,
        employee,
        body,
      );
      await this._assignEmployeeFacility(facility._id, employee._id);
      const otpCode = await this.generateVerificationPin(savedUser._id);

      return {
        errors: false,
        user_id: savedUser._id,
        full_name: savedUser.full_name,
        otpCode: otpCode.otp,
      };
    }
  }

  async _assignEmployeeFacility(facility_id: string, employee_id: string) {
    const role = await this.roleRep.findOne({ where: { name: 'Lab Admin' } });
    const department = await this.departmentRep.findOne({
      where: { name: 'lab' },
    });
    const employeeFacilityAttributes = {
      facility_id,
      employee_id,
      role_ids: [role._id],
    };
    if (department) {
      Object.assign(employeeFacilityAttributes, {
        departments: [department._id],
      });
    }
    return await this.saveWithDepartments(employeeFacilityAttributes, null);
  }

  async saveWithDepartments(data, id) {
    let model;
    if (id) {
      model = await this.empFacilityRep
        .createQueryBuilder('employee_facility')
        .select('employee_facility.*')
        .where('employee_facility._id = :_id', { _id: id })
        .getRawOne();
    } else {
      model = new EmployeeFacility();
    }
    model.employee_id = data.employee_id;
    model.facility_id = data.facility_id;
    model.role_ids = data.role_ids;

    if (id) {
      await this.empFacilityRep.update(id, model);
      await this.empFacilityDepartment
        .createQueryBuilder('employee_facility_department')
        .delete()
        .from(EmployeeFacilityDepartment)
        .where(
          'employee_facility_department.employee_facility_id = :employee_facility_id',
          { employee_facility_id: model._id },
        )
        .execute();
    } else {
      model = await this.empFacilityRep.save(model);
    }

    if (data.departments && data.departments.length > 0) {
      data.departments.map(async (department) => {
        let obj = {
          employee_id: data.employee_id,
          facility_id: data.facility_id,
          employee_facility_id: model._id,
          department_id: department,
        };
        await this.empFacilityDepartment.save(obj);
      });
    }
    return model;
  }

  async createNewUser(body: CreateUserRequestDto): Promise<SingleUserDto> {
    Object.assign(body, { name: body.full_name });
    if (body.portal != 'limware') {
      Object.assign(body, { isSuperUser: 1 });
    }
    const customer = await this.createCustomer(body);
    const facility = await this.createFacility(customer, body);
    const lab = await this.createLaboratory(customer, facility, body);
    const employee = await this.createEmployee(customer, facility, body);
    const savedUser = await this.createUser(
      customer,
      facility,
      employee,
      body,
      body.status,
      body.portal,
    );
    await this._assignEmployeeFacility(facility._id, employee._id);
    const { ...rest } = savedUser;
    return new SingleUserDto({
      ...rest,
      created_at: savedUser.created_at.getTime(), // set created_at field as timestamp
    });
  }

  async createCustomer(
    data: RegisterRequest | CreateUserRequestDto,
  ): Promise<Customers> {
    const { name, mobile_number, address, city } = data;
    const obj = {
      name,
      mobile_number,
      address,
      city,
      status: 1,
    };
    const customer = await this.customerRep.save(obj);
    if (customer) {
      return customer;
    } else {
      throw [
        {
          field: 'Error',
          message: 'Problem saving customer',
        },
      ];
    }
  }

  async createFacility(
    customer: Customers,
    data: RegisterRequest | CreateUserRequestDto,
  ): Promise<Facility> {
    const { name, mobile_number, address, city } = data;
    const obj = {
      name,
      mobile_number,
      address,
      city,
      status: 1,
      type: 'main',
      customer_id: customer,
    };
    const facility = await this.facilityRep.save(obj);
    if (facility) {
      return facility;
    } else {
      throw [
        {
          field: 'Error',
          message: 'Problem saving facility',
        },
      ];
    }
  }

  async createLaboratory(
    customer: Customers,
    facility: Facility,
    data: RegisterRequest | CreateUserRequestDto,
  ): Promise<Laboratory> {
    const { name, mobile_number } = data;
    const obj = {
      name,
      mobile_number,
      status: 1,
      type: 'main',
      customer_id: customer,
      facility_id: facility,
    };
    const lab = await this.labRep.save(obj);
    if (lab) {
      return lab;
    } else {
      throw [
        {
          field: 'Error',
          message: 'Problem saving laboratory',
        },
      ];
    }
  }

  async createEmployee(
    customer: Customers,
    facility: Facility,
    data: RegisterRequest | CreateUserRequestDto,
  ): Promise<Employee> {
    const { name, mobile_number, address, city } = data;
    const obj = {
      name,
      mobile_number,
      status: 1,
      address,
      city,
      customer_id: customer,
      facility_id: facility,
      gender: '',
    };
    const employee = await this.empRep.save(obj);
    if (employee) {
      return employee;
    } else {
      throw [
        {
          field: 'Error',
          message: 'Problem saving employee',
        },
      ];
    }
  }

  async createUser(
    customer: Customers,
    facility: Facility,
    employee: Employee,
    data: RegisterRequest | CreateUserRequestDto,
    status?: number,
    portal?: string,
  ): Promise<Users> {
    delete data.terms;
    const { password, ...rest } = data;
    const hashed = await bcrypt.hashSync(password, 10);
    const obj = {
      ...rest,
      customer_id: customer,
      facility_id: facility,
      employee_id: employee,
      status: status ? status : 0,
      password: hashed,
      password_hash: hashed,
      portal: portal ? portal : 'limware',
      full_name: data.name,
    };
    const user = await this.userRep.save(obj);
    if (user) {
      return user;
    } else {
      throw [
        {
          field: 'Error',
          message: 'Problem saving user',
        },
      ];
    }
  }

  async generateVerificationPin(user_id: string): Promise<Users> {
    const user = await this.userRep.findOne({ where: { _id: user_id } });
    const otpCode = uid.randomUUID(6);
    user.otp = otpCode;
    await this.userRep.update(user_id, user);
    return user;
  }
}
