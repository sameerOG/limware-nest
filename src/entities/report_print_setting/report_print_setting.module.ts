import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportPrintSetting } from "./report_print_setting.entity";
import { LaboratoriesController } from "./report_print_setting.controller";
import { ReportPrintSettingService } from "./report_print_setting.service";
import { FacilitiesService } from "../Facility/facilities/facilities.service";
import { Facility } from "../Facility/facility.entity";
import { Addons } from "../addons/addons.entity";
import { Laboratory } from "../laboratory/laboratory.entity";
import { Customers } from "../customer/customer.entity";
import { LaboratoriesService } from "../laboratory/laboratories/laboratories.service";
import { LaboratorySetting } from "../laboratory/laboratory_setting.entity";
import { DirectoryManagerService } from "src/shared/DirectoryManagerService";

@Module({
    imports: [TypeOrmModule.forFeature([ReportPrintSetting,Laboratory, Facility, Customers, Facility, Addons,LaboratorySetting])],
    controllers: [LaboratoriesController],
    providers: [ReportPrintSettingService, FacilitiesService, LaboratoriesService, DirectoryManagerService],
  })
  export class ReportPrintSettingsModule {}
  