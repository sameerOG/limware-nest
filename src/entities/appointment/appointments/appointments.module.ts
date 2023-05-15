import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facility } from 'src/entities/Facility/facility.entity';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { LabTestRateList } from 'src/entities/lab_test_rate/lab_test_rate_list.entity';
import { LabTestRateListItem } from 'src/entities/lab_test_rate/lab_test_rate_list_item.entity';
import { Patient } from 'src/entities/patient/patient.entity';
import { PatientAccount } from 'src/entities/patient/patient_account.entity';
import { Reference } from 'src/entities/reference/reference.entity';
import { Test } from 'src/entities/test/test.entity';
import { TestCategory } from 'src/entities/test/test_category.entity';
import { Appointment } from '../appointment.entity';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      Test,
      Laboratory,
      TestCategory,
      LabTestRateList,
      LabTestRateListItem,
      Reference,
      Facility,
      Patient,
      PatientAccount,
    ]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
