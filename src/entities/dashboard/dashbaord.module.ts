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
import { Patient } from '../patient/patient.entity';
import { PatientAccount } from '../patient/patient_account.entity';
import { PatientTest } from '../patient/patient_test.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PatientsService } from '../patient/patients/patients.service';

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
  controllers: [DashboardController],
  providers: [DashboardService, PatientsService],
})
export class DashboardModule {}
