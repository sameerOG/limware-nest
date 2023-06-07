import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Donor } from "./donor.entity";
import { DonorsController } from "./donor.controller";
import { DonorsService } from "./donoer.service";
import { LaboratoriesModule } from "../laboratory/laboratories/laboratories.module";
import { Laboratory } from "../laboratory/laboratory.entity";
import { LaboratoriesService } from "../laboratory/laboratories/laboratories.service";
import { LaboratorySetting } from "../laboratory/laboratory_setting.entity";
import { PatientTest } from "../patient/patient_test.entity";
import { PatientTestsService } from "../patient/patient-tests/patient-tests.service";
import { Facility } from "../Facility/facility.entity";
import { Patient } from "../patient/patient.entity";
import { FacilitiesService } from "../Facility/facilities/facilities.service";
import { Addons } from "../addons/addons.entity";
import { Customers } from "../customer/customer.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Donor, Laboratory, LaboratorySetting, Addons, Customers,PatientTest, Facility ,Patient])],
    controllers: [DonorsController],
    providers: [DonorsService, LaboratoriesService, PatientTestsService,FacilitiesService],
  })
  export class DonorsModule {}