import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePatientTestStatusRequestDto } from '../dto/request.dto';
import { PatientTest } from '../patient_test.entity';

@Injectable()
export class PatientTestsService {
  constructor(
    @InjectRepository(PatientTest)
    private patientTestRep: Repository<PatientTest>,
  ) {}

  async updateStatus(
    id: string,
    body: UpdatePatientTestStatusRequestDto,
  ): Promise<PatientTest> {
    await this.patientTestRep
      .createQueryBuilder('patient_test')
      .update(PatientTest)
      .set({ sample_status: body.sample_status })
      .where({ test_id: id })
      .execute();

    const data = await this.patientTestRep
      .createQueryBuilder('patient_test')
      .select('patient_test.*')
      .where('patient_test.test_id = :test_id', { test_id: id })
      .getRawOne();
    console.log('data', data);
    return data;
  }
}
