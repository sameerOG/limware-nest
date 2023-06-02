import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facility } from 'src/entities/Facility/facility.entity';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { Department } from '../department.entity';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Department, Facility, Laboratory])],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
})
export class DepartmentsModule {}
