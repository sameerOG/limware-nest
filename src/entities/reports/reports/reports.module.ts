import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileHandling } from 'src/common/file-handling';
import { Invoice } from 'src/entities/invoice/invoice.entity';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { Patient } from 'src/entities/patient/patient.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Invoice, Laboratory])],
  controllers: [ReportsController],
  providers: [ReportsService, FileHandling],
})
export class ReportsModule {}
