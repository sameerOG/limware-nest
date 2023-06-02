import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FacilitySmsSetting } from "./facility_sms_setting.entity";
import { FacilitiesSMSController } from "./facility_sms_settings.controller";
import { FacilitySmsSettingService } from "./facility_sms_setting.service";
import { Facility } from "../facility.entity";
import { Customers } from "src/entities/customer/customer.entity";
import { Addons } from "src/entities/addons/addons.entity";
import { FacilitiesService } from "../facilities/facilities.service";

@Module({
    imports: [TypeOrmModule.forFeature([Facility, Customers, Addons, FacilitySmsSetting,])],
    controllers: [FacilitiesSMSController],
    providers: [FacilitiesService, FacilitySmsSettingService ]
  })
  export class FacilitiesSmsSettingModule {}
  