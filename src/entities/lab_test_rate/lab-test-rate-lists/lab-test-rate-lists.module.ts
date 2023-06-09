import { Module } from '@nestjs/common';
import { LabTestRateListsService } from './lab-test-rate-lists.service';
import { LabTestRateListsController } from './lab-test-rate-lists.controller';
import { Test } from 'src/entities/test/test.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { LabTestRateList } from '../lab_test_rate_list.entity';
import { LabTestRateListItem } from '../lab_test_rate_list_item.entity';
import { FileHandling } from 'src/common/file-handling';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Test,
      Laboratory,
      LabTestRateList,
      LabTestRateListItem,
    ]),
  ],
  controllers: [LabTestRateListsController],
  providers: [LabTestRateListsService, FileHandling],
})
export class LabTestRateListsModule {}
