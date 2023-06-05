import { Controller, Headers, Get, Res, UseGuards, Put, Body } from "@nestjs/common";
import { FacilitiesService } from "../facilities/facilities.service";
import jwtDecode from "jwt-decode";
import { AuthGuard } from "src/guard/auth.guard";
import { FacilitySmsSettingService } from "./facility_sms_setting.service";

@Controller('facility-sms-settings')
@UseGuards(AuthGuard)
export class FacilitiesSMSController {
    constructor(private facilityService: FacilitiesService, private facilitySmsSettingService: FacilitySmsSettingService) { }

    @Get('/')
    async facilitySmsSettings(
        @Res() res,
        @Headers('Authorization') authHeader: string,
    ) {
        try {
            const token = authHeader.split(' ')[1];
            const loggedInUser: any = jwtDecode(token);
            const facility: any = await this.facilityService.getSingleFacilityById(loggedInUser?.facility_id);
            const smsSetting = await this.facilitySmsSettingService.getFacilitySettings(facility.facility_id);
            res.status(200).send(smsSetting)
            return smsSetting;
        }
        catch (e) {
            res.status(404).send({ message: 'Facility Not Found' })
            console.log(e);
        }

    }
    @Put('/update-sms')
    async updateSms(
        @Res() response,
        @Body() body,
        @Headers('Authorization') authHeader: string,
    ) {
        try {
            const token = authHeader.split(' ')[1];
            const loggedInUser: any = jwtDecode(token);
            const facility: any = await this.facilityService.getSingleFacilityById(loggedInUser?.facility_id);
            const updateSettings = await this.facilitySmsSettingService.updateFacilitySmsSetting(body, facility?.facility_id)
            response.status(200).send(updateSettings)
            return updateSettings;
        }
        catch (e) {
            response.status(404).send({ message: 'Settings Not Found' })
            console.log(e);
        }
    }
}
