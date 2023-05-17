import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/entities/employee/employee.entity';
import { EmployeeFacility } from 'src/entities/employee/employee_facility.entity';
import { Role } from 'src/entities/role/role.entity';
import { Users } from '../user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, EmployeeFacility, Role, Employee]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
