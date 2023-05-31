import { Module } from '@nestjs/common';
import { LabTestRateListsService } from './lab-test-rate-lists.service';
import { LabTestRateListsController } from './lab-test-rate-lists.controller';
import { Test } from 'src/entities/test/test.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Test, Laboratory])],
  controllers: [LabTestRateListsController],
  providers: [LabTestRateListsService],
})
export class LabTestRateListsModule {}
