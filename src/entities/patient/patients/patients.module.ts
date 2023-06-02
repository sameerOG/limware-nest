import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/entities/appointment/appointment.entity';
import { EmployeeFacility } from 'src/entities/employee/employee_facility.entity';
import { EmployeeFacilityDepartment } from 'src/entities/employee/employee_facility_department.entity';
import { Facility } from 'src/entities/Facility/facility.entity';
import { Invoice } from 'src/entities/invoice/invoice.entity';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { Test } from 'src/entities/test/test.entity';
import { TestCategory } from 'src/entities/test/test_category.entity';
import { Patient } from '../patient.entity';
import { PatientAccount } from '../patient_account.entity';
import { PatientTest } from '../patient_test.entity';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      Laboratory,
      Facility,
      Appointment,
      Invoice,
      PatientAccount,
      PatientTest,
      Patient,
      Test,
      EmployeeFacilityDepartment,
      TestCategory,
      EmployeeFacility
    ]),
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
