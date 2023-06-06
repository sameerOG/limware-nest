import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facility } from 'src/entities/Facility/facility.entity';
import { Patient } from '../patient.entity';
import { PatientTest } from '../patient_test.entity';
import { DeletedTestsController } from './deleted-tests.controller';
import { DeletedTestsService } from './deleted-tests.service';

@Module({
  imports: [TypeOrmModule.forFeature([PatientTest, Facility, Patient])],
  controllers: [DeletedTestsController],
  providers: [DeletedTestsService],
})
export class DeletedTestsModule {}
