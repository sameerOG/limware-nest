import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../user/user.entity';
import {
  AuthRequest,
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
  ) {}

  async login(body: AuthRequest): Promise<AuthDto> {
    const user = await this.userRep
      .createQueryBuilder('u')
      .select('u.*, JSON_AGG(f.*) as facilities')
      .leftJoin('facility', 'f', 'f._id = u.facility_id')
      .where(
        'u.email = :email OR u.username = :username OR u.mobile_number = :mobile_number',
        {
          email: body.username,
          username: body.username,
          mobile_number: body.username,
        },
      )
      .andWhere('u.status = :status', { status: 1 })
      .groupBy('u._id')
      .getRawOne();

    const facilities = [];
    console.log(user.facilities);
    user.facilities?.map((facility) => {
      if (facility) {
        const { name, type, _id, unique_id } = facility;

        facilities.push({
          name,
          unique_id,
          type,
          permissions: [],
          _id: {
            $oid: _id,
          },
        });
      }
    });

    if (user) {
      const authenticated = await bcrypt.compare(
        body.password,
        user['password'],
      );

      if (authenticated) {
        const {
          email,
          full_name,
          isSuperUser,
          portal,
          status,
          username,
          facility_id,
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
          user_id: {
            $oid: user._id,
          },
        };

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
        return null;
      }
    } else {
      return null;
    }
  }

  async logout(token: string): Promise<boolean> {
    const userToken: any = await this.userTokenRep.findOne({
      where: { access_token: token },
    });
    if (userToken) {
      await this.userTokenRep.delete(userToken._id)
      return true;
    } else {
      return false;
    }
  }

  async getProfile(id: string): Promise<ProfileResponse> {
    const user: Users = await this.userRep.findOne({
      select:['address','city','created_at','email','full_name','mobile_number','password_hash','status','updated_at','username','_id','contact_numbers'],
      where: { _id: id },
    });
    const {...rest} = user;
    return new ProfileResponse({
      ...rest,
      created_at:user.created_at.getTime(),
      updated_by:id,
      updated_at:user.updated_at.getTime()
    })
    
  }

  async loginIntoFacility(body: LoginIntoFacility): Promise<boolean> {
    const user: any = await this.userRep.findOne({
      where: { _id: body.user_id },
    });
    const userToken = await this.userTokenRep.findOne({
      where: { user_id: user },
    });
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
    console.log('username', user);
    if (user) {
      return { errors: true, user_id: user._id, full_name: user.full_name };
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

      await this.generateVerificationPin(savedUser._id);

      return {
        errors: false,
        user_id: savedUser._id,
        full_name: savedUser.full_name,
      };
    }
  }

  async createCustomer(data: RegisterRequest): Promise<Customers> {
    const { name, mobile_number, address, city } = data;
    const obj = {
      name,
      mobile_number,
      address,
      city,
      status: 1,
    };
    return await this.customerRep.save(obj);
  }

  async createFacility(
    customer: Customers,
    data: RegisterRequest,
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
    return await this.facilityRep.save(obj);
  }

  async createLaboratory(
    customer: Customers,
    facility: Facility,
    data: RegisterRequest,
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
    return await this.labRep.save(obj);
  }

  async createEmployee(
    customer: Customers,
    facility: Facility,
    data: RegisterRequest,
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
    return await this.empRep.save(obj);
  }

  async createUser(
    customer: Customers,
    facility: Facility,
    employee: Employee,
    data: RegisterRequest,
  ): Promise<Users> {
    delete data.terms;
    const { password, ...rest } = data;
    const hashed = await bcrypt.hashSync(password, 10);
    const obj = {
      ...rest,
      customer_id: customer,
      facility_id: facility,
      employee_id: employee,
      status: 0,
      password: hashed,
      password_hash: hashed,
      portal: 'limware',
      full_name: data.name,
    };
    return await this.userRep.save(obj);
  }

  async generateVerificationPin(user_id: string): Promise<Users> {
    const user = await this.userRep.findOne({ where: { _id: user_id } });
    const otpCode = uid.randomUUID(6);
    user.otp = otpCode;
    await this.userRep.update(user_id, user);
    return user;
  }
}
