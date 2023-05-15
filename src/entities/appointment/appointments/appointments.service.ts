import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Error } from 'src/common/global-dto.dto';
import { Facility } from 'src/entities/Facility/facility.entity';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { LabTestRateList } from 'src/entities/lab_test_rate/lab_test_rate_list.entity';
import { LabTestRateListItem } from 'src/entities/lab_test_rate/lab_test_rate_list_item.entity';
import { Patient } from 'src/entities/patient/patient.entity';
import { PatientAccount } from 'src/entities/patient/patient_account.entity';
import { Reference } from 'src/entities/reference/reference.entity';
import { Test } from 'src/entities/test/test.entity';
import { TestCategory } from 'src/entities/test/test_category.entity';
import { Repository } from 'typeorm';
import { Appointment } from '../appointment.entity';
import { AddAppointment, SearchPatientRequest } from '../dto/request.dto';
import { isEmpty } from 'lodash';
import {
  GetAllReferences,
  GetAllTests,
  SearchPatient,
} from '../dto/response.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Laboratory)
    private labRep: Repository<Laboratory>,
    @InjectRepository(Appointment)
    private appointmentRep: Repository<Appointment>,
    @InjectRepository(Test)
    private testRep: Repository<Test>,
    @InjectRepository(TestCategory)
    private testCategoryRep: Repository<TestCategory>,
    @InjectRepository(LabTestRateList)
    private labTestRateListRep: Repository<LabTestRateList>,
    @InjectRepository(LabTestRateListItem)
    private labTestRateListItemRep: Repository<LabTestRateListItem>,
    @InjectRepository(Reference)
    private referenceRep: Repository<Reference>,
    @InjectRepository(Facility)
    private facilityRep: Repository<Facility>,
    @InjectRepository(PatientAccount)
    private patientAccountRep: Repository<PatientAccount>,
    @InjectRepository(Patient)
    private patientRep: Repository<Patient>,
  ) {}

  async getAllTests(user): Promise<GetAllTests[]> {
    const labModal = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    let laboratory_id = labModal?._id;

    if (labModal?.type === 'cc') {
      const mainLabModal = await this.labRep
        .createQueryBuilder('laboratory')
        .select('laboratory.*')
        .where('laboratory.parent_lab_id = :parent_lab_id', {
          parent_lab_id: labModal.parent_lab_id,
        })
        .getRawOne();

      laboratory_id = mainLabModal?._id;
    }

    const categoryModal = await this.testCategoryRep
      .createQueryBuilder('test_category')
      .select(
        'test_category._id,test_category.name,test_category.title_for_print',
      )
      .where('test_category.laboratory_id = :laboratory_id', { laboratory_id })
      .getRawMany();

    const rateListModal = await this.labTestRateListRep
      .createQueryBuilder('lab_test_rate_list')
      .select('lab_test_rate_list.*')
      .where('lab_test_rate_list.laboratory_id = :laboratory_id', {
        laboratory_id,
      })
      .andWhere('lab_test_rate_list.status = :status', { status: 1 })
      .getRawOne();

    let rateListItemModal = [];
    if (rateListModal) {
      rateListItemModal = await this.labTestRateListItemRep
        .createQueryBuilder('lab_test_rate_list_item')
        .select('lab_test_rate_list_item.*')
        .where(
          'lab_test_rate_list_item.lab_test_rate_list_id = :lab_test_rate_list_id',
          { lab_test_rate_list_id: rateListModal._id },
        )
        .getRawMany();
    }

    let returnResult = [];
    for (let i = 0; i < categoryModal.length; i++) {
      const tests = await this.testRep
        .createQueryBuilder('test')
        .select('test.*')
        .where('test.test_category_id = :test_category_id', {
          test_category_id: categoryModal[i]._id,
        })
        .andWhere('test.archived = :archived', { archived: false })
        .getRawMany();

      for (let j = 0; j < tests.length; j++) {
        if (!tests[i].parametric_only) {
          let testToPush = {
            _id: tests[j]._id,
            name: tests[j].name,
            code: tests[j].code,
            title_for_print: tests[j].title_for_print,
            price: 0,
            category: categoryModal[i].name,
            tags: tests[j].tags,
          };

          for (let k = 0; k < rateListItemModal.length; k++) {
            if (rateListItemModal[k].test_id === tests[j]._id) {
              testToPush.price = rateListItemModal[k].price;
            }
          }

          returnResult.push(testToPush);
        }
      }
    }

    return returnResult;
  }

  async getAllReferences(user): Promise<GetAllReferences[]> {
    const labModal = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    let facility_id = user.facility_id;
    if (labModal?.type === 'cc') {
      facility_id = labModal.facility_id;
    }

    const data = await this.referenceRep
      .createQueryBuilder('reference')
      .select('reference._id,reference.name')
      .where('reference.facility_id = :facility_id', { facility_id })
      .orderBy('reference.name', 'ASC')
      .getRawMany();

    return data;
  }

  async searchPatient(
    user,
    body: SearchPatientRequest,
  ): Promise<SearchPatient> {
    const facility = await this.facilityRep.findOne({
      where: { _id: user.facility_id },
    });
    const parent_facility_id: string = facility?.parent_facility_id
      ? facility?.parent_facility_id
      : user.facility_id;
    const patientAccount: PatientAccount = await this.patientAccountRep
      .createQueryBuilder('patient_account')
      .select('patient_account.*')
      .where('patient_account.parent_facility_id = :parent_facility_id', {
        parent_facility_id,
      })
      .where('patient_account.mobile_number = :mobile_number', {
        mobile_number: body.mobile_number,
      })
      .getRawOne();

    if (patientAccount) {
      const patients = await this.patientRep
        .createQueryBuilder('patient')
        .select(
          'patient._id,patient.name,patient.age,patient.age_unit,patient.gender,patient.mobile_number,patient.unique_id,patient.address,patient.city,patient.dob',
        )
        .where('patient.patient_account_id = :patient_account_id', {
          patient_account_id: patientAccount._id,
        })
        .orderBy('patient.created_at', 'DESC')
        .getRawMany();

      let filteredPatients = [];
      for (let i = 0; i < patients.length; i++) {
        let found = false;
        for (let j = 0; j < filteredPatients.length; j++) {
          if (filteredPatients[j].name === patients[i].name) {
            found = true;
          }
        }

        if (!found) {
          filteredPatients.push(patients[i]);
        }
      }
      return {
        patientAccount,
        patients: filteredPatients,
      };
    } else {
      throw {
        field: 'mobile_number',
        message: 'Patient not found',
      };
    }
  }
}
