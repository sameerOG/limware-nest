import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customers } from '../customer/customer.entity';
import { Employee } from '../employee/employee.entity';
import { Facility } from '../Facility/facility.entity';
import { Laboratory } from '../laboratory/laboratory.entity';
import { Users } from '../user/user.entity';
import { UserAccessToken } from '../user_access_token/user_access_token.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      UserAccessToken,
      Customers,
      Facility,
      Laboratory,
      Employee,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
