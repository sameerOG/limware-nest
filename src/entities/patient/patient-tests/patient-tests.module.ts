import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facility } from 'src/entities/Facility/facility.entity';
import { Patient } from '../patient.entity';
import { PatientTest } from '../patient_test.entity';
import { PatientTestsController } from './patient-tests.controller';
import { PatientTestsService } from './patient-tests.service';

@Module({
  imports: [TypeOrmModule.forFeature([PatientTest, Facility, Patient])],
  controllers: [PatientTestsController],
  providers: [PatientTestsService],
})
export class PatientTestsModule {}
