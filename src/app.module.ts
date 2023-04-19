import { Module } from '@nestjs/common';
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
