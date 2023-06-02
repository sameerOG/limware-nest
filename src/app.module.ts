import { Module } from '@nestjs/common';
const path = require('path');

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ServeStaticModule } from '@nestjs/serve-static';

import { getEnvPath } from './common/helper/env.helper';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { MulterModule } from '@nestjs/platform-express';
import { MailerModule } from '@nestjs-modules/mailer';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './entities/user/users/users.module';
import { UsersRolesModule } from './entities/user_role/users-roles/users-roles.module';
import { RolesModule } from './entities/role/roles/roles.module';
import { SpecimensModule } from './entities/specimen/specimens/specimens.module';
import { CustomersModule } from './entities/customer/customers/customers.module';
import { TestCategoriesModule } from './entities/test/test-categories/test-categories.module';
import { UomModule } from './entities/uom/uom/uom.module';
import { OutgoingMailServersModule } from './entities/MailServer/outgoing-mail-servers/outgoing-mail-servers.module';
import { EmailTemplatesModule } from './entities/MailServer/email-templates/email-templates.module';
import { FacilitiesModule } from './entities/Facility/facilities/facilities.module';
import { LaboratoriesModule } from './entities/laboratory/laboratories/laboratories.module';
import { EmployeesModule } from './entities/employee/employees/employees.module';
import { AddonsModule } from './entities/addons/addons/addons.module';
import { DepartmentsModule } from './entities/department/departments/departments.module';
import { AuthModule } from './entities/auth/auth.module';
import { TestsModule } from './entities/test/tests/tests.module';
import { TestParametersModule } from './entities/test/test-parameters/test-parameters.module';
import { AppointmentsModule } from './entities/appointment/appointments/appointments.module';
import { join } from 'path';
import { FeaturesModule } from './entities/features/features/features.module';
import { PricingPlansModule } from './entities/pricing/pricing-plans/pricing-plans.module';
import { PatientsModule } from './entities/patient/patients/patients.module';
import { InvoicesModule } from './entities/invoice/invoices/invoices.module';
import { ReportPrintSettingsModule } from './entities/report_print_setting/report_print_setting.module';
import { InvoicePrintSettingsModule } from './entities/invoice/invoice_print_setting/invoice_print_setting.module';
import { FacilitiesSmsSettingModule } from './entities/Facility/facility_sms_settings/facility_sms_setting.module';

const envFilePath: string = getEnvPath(`/common/envs`);
dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    MulterModule.register({
      dest: './files',
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ServeStaticModule.forRoot({
      rootPath: 'src/common/uploads',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true, // upgrade later with STARTTLS
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_MAIL}>`,
      },
    }),
    CustomersModule,
    UsersModule,
    UsersRolesModule,
    RolesModule,
    SpecimensModule,
    TestCategoriesModule,
    UomModule,
    OutgoingMailServersModule,
    EmailTemplatesModule,
    FacilitiesModule,
    LaboratoriesModule,
    EmployeesModule,
    AddonsModule,
    DepartmentsModule,
    AuthModule,
    TestsModule,
    TestParametersModule,
    AppointmentsModule,
    FeaturesModule,
    PricingPlansModule,
    PatientsModule,
    InvoicesModule,
    ReportPrintSettingsModule,
    InvoicePrintSettingsModule,
    FacilitiesSmsSettingModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
