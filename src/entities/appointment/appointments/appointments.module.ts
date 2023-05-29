import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Addons } from 'src/entities/addons/addons.entity';
import { Facility } from 'src/entities/Facility/facility.entity';
import { Invoice } from 'src/entities/invoice/invoice.entity';
import { InvoiceLineItem } from 'src/entities/invoice/invoice_line_item.entity';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { LabTestRateList } from 'src/entities/lab_test_rate/lab_test_rate_list.entity';
import { LabTestRateListItem } from 'src/entities/lab_test_rate/lab_test_rate_list_item.entity';
import { Patient } from 'src/entities/patient/patient.entity';
import { PatientAccount } from 'src/entities/patient/patient_account.entity';
import { PatientTest } from 'src/entities/patient/patient_test.entity';
import { PatientTestParameterResult } from 'src/entities/patient/patient_test_parameter_result.entity';
import { PaymentTRansaction } from 'src/entities/pricing/payment_transaction.entity';
import { Reference } from 'src/entities/reference/reference.entity';
import { Test } from 'src/entities/test/test.entity';
import { TestCategory } from 'src/entities/test/test_category.entity';
import { TestNormalRange } from 'src/entities/test/test_normal_range.entity';
import { TestParameter } from 'src/entities/test/test_parameter.entity';
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
      Addons,
      Invoice,
      PatientTest,
      TestNormalRange,
      PatientTestParameterResult,
      TestParameter,
      PaymentTRansaction,
      InvoiceLineItem,
    ]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
