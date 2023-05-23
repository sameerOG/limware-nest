import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { PatientTest } from 'src/entities/patient/patient_test.entity';
import { PatientTestParameterResult } from 'src/entities/patient/patient_test_parameter_result.entity';
import { Test } from '../test.entity';
import { TestsModule } from '../tests/tests.module';
import { TestGroup } from '../test_group.entity';
import { TestNormalRange } from '../test_normal_range.entity';
import { TestParameter } from '../test_parameter.entity';
import { TestParametersController } from './test-parameters.controller';
import { TestParametersService } from './test-parameters.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Laboratory,
      TestParameter,
      TestGroup,
      Test,
      PatientTest,
      PatientTestParameterResult,
      TestNormalRange,
    ]),
    TestsModule,
  ],
  controllers: [TestParametersController],
  providers: [TestParametersService],
})
export class TestParametersModule {}
