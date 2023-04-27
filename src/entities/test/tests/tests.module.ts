import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { LabTestRateList } from 'src/entities/lab_test_rate/lab_test_rate_list.entity';
import { LabTestRateListItem } from 'src/entities/lab_test_rate/lab_test_rate_list_item.entity';
import { PatientTest } from 'src/entities/patient/patient_test.entity';
import { PatientTestParameterResult } from 'src/entities/patient/patient_test_parameter_result.entity';
import { Specimen } from '../dto/test-category/response.dto';
import { Test } from '../test.entity';
import { TestCategory } from '../test_category.entity';
import { TestGroup } from '../test_group.entity';
import { TestNormalRange } from '../test_normal_range.entity';
import { TestParameter } from '../test_parameter.entity';
import { TestsController } from './tests.controller';
import { TestsService } from './tests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Test,
      TestCategory,
      Laboratory,
      LabTestRateList,
      LabTestRateListItem,
      TestGroup,
      Specimen,
      TestNormalRange,
      TestParameter,
      PatientTest,
      PatientTestParameterResult,
    ]),
  ],
  controllers: [TestsController],
  providers: [TestsService],
})
export class TestsModule {}
