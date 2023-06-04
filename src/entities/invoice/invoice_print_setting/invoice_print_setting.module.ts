import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InvoicePrintSettingsSerive } from "./report_print_setting.service";
import { FacilitiesService } from "../../Facility/facilities/facilities.service";
import { Facility } from "../../Facility/facility.entity";
import { Addons } from "../../addons/addons.entity";
import { Laboratory } from "../../laboratory/laboratory.entity";
import { Customers } from "../../customer/customer.entity";
import { LaboratoriesService } from "../../laboratory/laboratories/laboratories.service";
import { LaboratorySetting } from "../../laboratory/laboratory_setting.entity";
import { DirectoryManagerService } from "src/shared/DirectoryManagerService";
import { InvoicePrintSettings } from "../invoice_print_settings.entity";
import { InvoicePrintSettingsController } from "./invoice_print_setting.controller";

@Module({
    imports: [TypeOrmModule.forFeature([InvoicePrintSettings,Laboratory, Facility, Customers, Facility, Addons,LaboratorySetting])],
    controllers: [InvoicePrintSettingsController],
    providers: [InvoicePrintSettingsSerive, FacilitiesService, LaboratoriesService, DirectoryManagerService],
  })
  export class InvoicePrintSettingsModule {}
  