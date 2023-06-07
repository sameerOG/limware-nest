import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/entities/appointment/appointment.entity';
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
import { PatientTestParameterResult } from '../patient/patient_test_parameter_result.entity';
import { TestNormalRange } from '../test/test_normal_range.entity';
import { InvoicesService } from '../invoice/invoices/invoices.service';
import { InvoiceLineItem } from '../invoice/invoice_line_item.entity';
import { InvoicePrintSettings } from '../invoice/invoice_print_settings.entity';
import { PaymentTRansaction } from '../pricing/payment_transaction.entity';
import { PatientsModule } from '../patient/patients/patients.module';
import { InvoicesModule } from '../invoice/invoices/invoices.module';
import { FileHandling } from 'src/common/file-handling';
import { AppointmentsService } from '../appointment/appointments/appointments.service';
import { LabTestRateList } from '../lab_test_rate/lab_test_rate_list.entity';
import { LabTestRateListItem } from '../lab_test_rate/lab_test_rate_list_item.entity';
import { Reference } from '../reference/reference.entity';
import { Addons } from '../addons/addons.entity';
import { TestParameter } from '../test/test_parameter.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Patient, Invoice,   InvoiceLineItem,
    Invoice,
    Patient,
    InvoicePrintSettings,
    Laboratory,
    Appointment,
    Appointment,
    Test,
    TestCategory,
    LabTestRateList,
    LabTestRateListItem,
    Reference,
    Facility,
    PatientAccount,
    Addons,
    Invoice,
    PatientTest,
    TestNormalRange,
    PatientTestParameterResult,
    TestParameter,
    PaymentTRansaction,
    InvoiceLineItem,
    PaymentTRansaction,]), PatientsModule, InvoicesModule,
  ],
  controllers: [DashboardController ],
  providers: [DashboardService, InvoicesService, FileHandling, AppointmentsService],
})
export class DashboardModule {}
