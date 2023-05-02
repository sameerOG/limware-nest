import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { Test } from '../test.entity';
import { TestGroup } from '../test_group.entity';
import { TestParameter } from '../test_parameter.entity';
import { TestParametersController } from './test-parameters.controller';
import { TestParametersService } from './test-parameters.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Laboratory, TestParameter, TestGroup, Test]),
  ],
  controllers: [TestParametersController],
  providers: [TestParametersService],
})
export class TestParametersModule {}
