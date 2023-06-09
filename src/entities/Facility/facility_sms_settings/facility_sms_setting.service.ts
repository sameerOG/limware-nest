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
    const smsSettings = await this.facilitySmsRep.findOne({where:{facility_id: facility_id}}); 
    if(smsSettings){
        if(data.reports_done_and_payment_pending_sms != undefined && data.reports_done_and_payment_pending_sms_status != undefined){
          smsSettings.reports_done_and_payment_pending_sms = data.reports_done_and_payment_pending_sms;
          smsSettings.reports_done_and_payment_pending_sms_status = data.reports_done_and_payment_pending_sms_status
          return await this.facilitySmsRep.save(smsSettings)
        }
        if(data.reports_done_sms != undefined && data.reports_done_sms_status != undefined){
          smsSettings.reports_done_sms = data.reports_done_sms;
          smsSettings.reports_done_sms_status = data.reports_done_sms_status;
          return await this.facilitySmsRep.save(smsSettings)
        }
    }
    else{
      return {message: 'settings not updated'}
    }
  }
  }