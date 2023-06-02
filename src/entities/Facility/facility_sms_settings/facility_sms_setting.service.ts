import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FacilitySmsSetting } from "./facility_sms_setting.entity";
import { Repository } from "typeorm";

@Injectable()
export class FacilitySmsSettingService {
    @InjectRepository(FacilitySmsSetting)
    private facilitySmsRep: Repository<FacilitySmsSetting>
  constructor(
   
  ) {}
  async getFacilitySettings(facility_id){
  return await this.facilitySmsRep.findOne({where: {facility_id: facility_id}})
  }
  async updateFacilitySmsSetting(data, facility_id){
    const smsSettings = await this.facilitySmsRep.findOne({where:{facility_id: facility_id}})
    if(smsSettings){
        {/** need to done */}
    }
  return smsSettings;
  }
  }