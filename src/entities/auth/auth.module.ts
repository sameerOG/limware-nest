import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customers } from '../customer/customer.entity';
import { Department } from '../department/department.entity';
import { Employee } from '../employee/employee.entity';
import { EmployeeFacility } from '../employee/employee_facility.entity';
import { EmployeeFacilityDepartment } from '../employee/employee_facility_department.entity';
import { Facility } from '../Facility/facility.entity';
import { Laboratory } from '../laboratory/laboratory.entity';
import { Role } from '../role/role.entity';
import { Users } from '../user/user.entity';
import { UserAccessToken } from '../user_access_token/user_access_token.entity';
import { UserRole } from '../user_role/user_role.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ReportPrintSetting } from '../report_print_setting/report_print_setting.entity';
import { LaboratorySetting } from '../laboratory/laboratory_setting.entity';
import { InvoicePrintSettings } from '../invoice/invoice_print_settings.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      UserAccessToken,
      Customers,
      Facility,
      Laboratory,
      Employee,
      Role,
      EmployeeFacility,
      EmployeeFacilityDepartment,
      Department,
      UserRole,
      ReportPrintSetting,
      LaboratorySetting,
      InvoicePrintSettings
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
