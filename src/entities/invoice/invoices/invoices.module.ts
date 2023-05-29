import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { InvoiceLineItem } from '../invoice_line_item.entity';
import { Invoice } from '../invoice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceLineItem, Invoice])],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
