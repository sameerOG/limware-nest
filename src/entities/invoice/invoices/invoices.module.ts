import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { InvoiceLineItem } from '../invoice_line_item.entity';
import { Invoice } from '../invoice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from 'src/entities/patient/patient.entity';
import { InvoicePrintSettings } from '../invoice_print_settings.entity';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { FileHandling } from 'src/common/file-handling';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvoiceLineItem,
      Invoice,
      Patient,
      InvoicePrintSettings,
      Laboratory,
    ]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, FileHandling],
})
export class InvoicesModule {}
