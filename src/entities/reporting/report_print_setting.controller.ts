import { Body, Controller, Get, Headers, Inject, Post, Res, UseGuards } from "@nestjs/common";
import { ReportPrintSettingService } from "./report_print_setting.service";
import jwtDecode from "jwt-decode";
import { AuthGuard } from "src/guard/auth.guard";
import { FacilitiesService } from "../Facility/facilities/facilities.service";
import { LaboratoriesService } from "../laboratory/laboratories/laboratories.service";
import { PrintReportSettingDto } from "./dto/request.dto";

@Controller('report-print-settings')
@UseGuards(AuthGuard)
export class LaboratoriesController {
    @Inject(ReportPrintSettingService)
    private readonly reportPrintService: ReportPrintSettingService;
    @Inject(FacilitiesService)
    private readonly facilityService: FacilitiesService;
    @Inject(LaboratoriesService)
    private readonly laboratoriesService: LaboratoriesService
    constructor() { }
    @Get('/view')
    async getReportMargins(
        @Res() response,
        @Headers('Authorization') authHeader: string,
    ) {
        try {
            const token = authHeader.split(' ')[1];
            const loggedInUser: any = jwtDecode(token);
            const facility: any = await this.facilityService.getSingleFacilityById(loggedInUser.facility_id);
            const laboratory = await this.laboratoriesService.getLabForSetting(facility?._id);
            const reportPrintSetting = await this.reportPrintService.getReportPrintSettings(laboratory?.laboratory_id);
            response.status(200).send(reportPrintSetting);
            return reportPrintSetting;
        } catch (err) {
            console.log('err in catch', err);
            response.status(400).send({ error: err, message: 'margins not found' });
        }
    }
    @Post('/change-header-type')
    async changeHeader(
        @Res() response,
        @Headers('Authorization') authHeader: string,
        @Body() body: any
    ) {
        try {
            const token = authHeader.split(' ')[1];
            const loggedInUser: any = jwtDecode(token);
            const facility: any = await this.facilityService.getSingleFacilityById(loggedInUser.facility_id);
            const laboratory = await this.laboratoriesService.getLabForSetting(facility?._id);
            const reportPrintSetting = await this.reportPrintService.updateHeaderType(laboratory?.laboratory_id, body);
            response.status(200).send(reportPrintSetting);
            return reportPrintSetting;
        } catch (err) {
            console.log('err in catch', err);
            response.status(400).send({ error: err, message: 'header type not changed' });
        }

    }
    @Post('/change-footer-type')
    async changeFooter(
        @Res() response,
        @Headers('Authorization') authHeader: string,
        @Body() body: any
    ) {
        try {
            const token = authHeader.split(' ')[1];
            const loggedInUser: any = jwtDecode(token);
            const facility: any = await this.facilityService.getSingleFacilityById(loggedInUser.facility_id);
            const laboratory = await this.laboratoriesService.getLabForSetting(facility?._id);
            const reportPrintSetting = await this.reportPrintService.updateFooterType(laboratory?.laboratory_id, body);
            response.status(200).send(reportPrintSetting);
            return reportPrintSetting;
        } catch (err) {
            console.log('err in catch', err);
            response.status(400).send({ error: err, message: 'footer type not changed' });
        }

    }
    @Post('/save-report-settings')
    async saveSettings(
        @Res() response,
        @Headers('Authorization') authHeader: string,
        @Body() body: any
    ) {
        try {
            const token = authHeader.split(' ')[1];
            const loggedInUser: any = jwtDecode(token);
            const facility: any = await this.facilityService.getSingleFacilityById(loggedInUser.facility_id);
            const laboratory = await this.laboratoriesService.getLabForSetting(facility?._id);
            const reportPrintSetting = await this.reportPrintService.saveReportSettings(laboratory?.laboratory_id, body);
            response.status(200).send(reportPrintSetting);
            return reportPrintSetting;
        } catch (err) {
            console.log('err in catch', err);
            response.status(400).send({ error: err, message: 'Settings not change' });
        }

    }

}
