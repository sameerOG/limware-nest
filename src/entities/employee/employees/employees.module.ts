import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from 'src/entities/department/department.entity';
import { Facility } from 'src/entities/Facility/facility.entity';
import { Role } from 'src/entities/role/role.entity';
import { Employee } from '../employee.entity';
import { EmployeeFacility } from '../employee_facility.entity';
import { EmployeeFacilityDepartment } from '../employee_facility_department.entity';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      Facility,
      EmployeeFacility,
      EmployeeFacilityDepartment,
      Role,
      Department,
    ]),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
