import { Body, Headers, Controller, Get, Inject, Res, Post, Put, HttpException } from "@nestjs/common";
import { LaboratoriesService } from "../laboratories/laboratories.service";
import jwtDecode from "jwt-decode";
import { FacilitiesService } from "../../Facility/facilities/facilities.service";
import { Laboratory } from "../laboratory.entity";
import { LaboratoriesSettingsDto } from "./laboratories.settings.dto";
import { LaboratorySetting } from "../laboratory_setting.entity";

@Controller('laboratory-settings')
export class LaboratorySettingsController {
    @Inject(LaboratoriesService)
    private readonly laboratoriesService: LaboratoriesService;
    @Inject(FacilitiesService)
    private readonly facilityService: FacilitiesService;
    @Inject(LaboratoriesService)
    private readonly labService: LaboratoriesService
    constructor() { }

    @Get('/')
    async laboratorySettings(
        @Res() res,
        @Headers('Authorization') authHeader: string,
    ) {
        try {
            const token = authHeader.split(' ')[1];
            const loggedInUser: any = jwtDecode(token);
            const facility: any = await this.facilityService.getSingleFacilityById(loggedInUser?.facility_id);
            const laboratorySetting = await this.labService.getSingleLabSettings(facility?._id);
            res.status(200).send(laboratorySetting)
            return laboratorySetting;
        }
        catch (e) {
            res.status(404).send({ message: 'Facility Not Found' })
            console.log(e);
        }

    }

    @Put('/update-setting')
    async updateSetting(
        @Res() response,
        @Body() data,
        @Headers('Authorization') authHeader: string
    ) {
        try {
            const token = authHeader.split(' ')[1];
            const loggedInUser: any = jwtDecode(token);
            const facility: any = await this.facilityService.getSingleFacilityById(loggedInUser?.facility_id);
            const laboratory = await this.labService.getLab(facility._id);
            const settings: any = await this.labService.updateLabSettings(data, facility?._id, laboratory._id);
            console.log(settings, 'tum hi ana');
            
            response.status(201).send(settings);
            return settings;
        }
        catch (err) {
            console.log('err in catch', err);
            response.status(400).send({ message: err })

        }
    }
    @Get('/get-lab-setting-for-save-test')
    async getLabSettingForSaveTest(
        @Res() response,
        @Headers('Authorization') authHeader: string,
    ): Promise<LaboratorySetting> {
        try {
            const token = authHeader.split(' ')[1];
            const loggedInUser = jwtDecode(token);
            let data = await this.laboratoriesService.getLabSettingForSaveTest(loggedInUser);
            response.status(200).send(data);
            if (data) {
                return data;
            } else {
                throw new HttpException(
                    { err: true, messages: 'Lab Settings not found' },
                    422,
                );
            }
        } catch (err) {
            console.log('err in catch', err);
            response.status(422).send({ error: err, message: 'Patient not updated' });
        }
    }
}