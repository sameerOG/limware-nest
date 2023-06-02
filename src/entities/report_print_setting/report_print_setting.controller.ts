import { Body, Controller, Get, Headers, Inject, Post, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ReportPrintSettingService } from "./report_print_setting.service";
import jwtDecode from "jwt-decode";
import { AuthGuard } from "src/guard/auth.guard";
import { FacilitiesService } from "../Facility/facilities/facilities.service";
import { LaboratoriesService } from "../laboratory/laboratories/laboratories.service";
import { DirectoryManagerService } from "src/shared/DirectoryManagerService";
import { FileInterceptor } from "@nestjs/platform-express";
import * as fs from 'fs-extra';
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
    @Inject(DirectoryManagerService)
    private readonly directoryManagerService: DirectoryManagerService
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
    @Post('/save-header-text')
    async saveHeaderText(
        @Res() response,
        @Headers('Authorization') authHeader: string,
        @Body() body: any
    ) {
        try {
            const token = authHeader.split(' ')[1];
            const loggedInUser: any = jwtDecode(token);
            const facility: any = await this.facilityService.getSingleFacilityById(loggedInUser.facility_id);
            const laboratory = await this.laboratoriesService.getLabForSetting(facility?._id);
            const reportPrintSetting = await this.reportPrintService.saveHeaderText(laboratory?.laboratory_id, body);
            response.status(200).send(reportPrintSetting);
            return reportPrintSetting;
        } catch (err) {
            console.log('err in catch', err);
            response.status(400).send({ error: err, message: 'Settings not change' });
        }

    }
    @Post('/save-footer-text')
    async saveFooterText(
        @Res() response,
        @Headers('Authorization') authHeader: string,
        @Body() body: any
    ) {
        try {
            const token = authHeader.split(' ')[1];
            const loggedInUser: any = jwtDecode(token);
            const facility: any = await this.facilityService.getSingleFacilityById(loggedInUser.facility_id);
            const laboratory = await this.laboratoriesService.getLabForSetting(facility?._id);
            const reportPrintSetting = await this.reportPrintService.saveFooterText(laboratory?.laboratory_id, body);
            response.status(200).send(reportPrintSetting);
            return reportPrintSetting;
        } catch (err) {
            console.log('err in catch', err);
            response.status(400).send({ error: err, message: 'Settings not change' });
        }

    }

    @Post('/save-header-image')
    @UseInterceptors(FileInterceptor('header_image_file'))
    async saveHeaderImage(
        @Res() response,
        @Headers('Authorization') authHeader: string,
        @UploadedFile() file,
    ) {
        try {            
            if (file) {
                const token = authHeader.split(' ')[1];
                const loggedInUser: any = jwtDecode(token);
                const facility: any = await this.facilityService.getSingleFacilityById(loggedInUser.facility_id);
                const laboratory = await this.laboratoriesService.getLabForSetting(facility?._id);
                const type = 'laboratories';
                const name = laboratory?.laboratory_id;
                const position = 'header';
                const obj = {
                    type: type,
                    name: name,
                    position: position,
                    file: file
                }
                const header_image_name = await this.directoryManagerService.uploadFile(obj);
                const reportPrintSetting = await this.reportPrintService.saveHeaderImage(laboratory?.laboratory_id, header_image_name);
                response.status(200).send(reportPrintSetting);
                return reportPrintSetting;
            }
            else {
                return response.status(400).send({ message: 'Invalid data' })
            }

        } catch (err) {
            console.log('err in catch', err);
            response.status(400).send({ error: err, message: 'Settings not change' });
        }

    }

    @Post('/save-footer-image')
    @UseInterceptors(FileInterceptor('footer_image_file'))
    async saveFooterImage(
        @Res() response,
        @Headers('Authorization') authHeader: string,
        @UploadedFile() file,
    ) {
        try {            
            if (file) {
                const token = authHeader.split(' ')[1];
                const loggedInUser: any = jwtDecode(token);
                const facility: any = await this.facilityService.getSingleFacilityById(loggedInUser.facility_id);
                const laboratory = await this.laboratoriesService.getLabForSetting(facility?._id);
                const type = 'laboratories';
                const name = laboratory?.laboratory_id;
                const position = 'footer';
                const obj = {
                    type: type,
                    name: name,
                    position: position,
                    file: file
                }
                const footer_image_name = await this.directoryManagerService.uploadFile(obj);
                const reportPrintSetting = await this.reportPrintService.saveFooterImage(laboratory?.laboratory_id, footer_image_name);
                response.status(200).send(reportPrintSetting);
                return reportPrintSetting;
            }
            else {
                return response.status(400).send({ message: 'Invalid data' })
            }

        } catch (err) {
            console.log('err in catch', err);
            response.status(400).send({ error: err, message: 'Settings not change' });
        }

    }
    @Get('/get-header-image')
    async getHeaderImage(
      @Headers('Authorization') authHeader: string,
      @Res() res
    ): Promise<any> {
      try {
        const token = authHeader.split(' ')[1];
        const loggedInUser: any = jwtDecode(token);
        const facility: any = await this.facilityService.getSingleFacilityById(loggedInUser.facility_id);
        const laboratory = await this.laboratoriesService.getLabForSetting(facility?._id);
        const id = laboratory?.laboratory_id;
        const facilityDirectory = `src/common/uploads/laboratories/${id}/header`;
        const readfiles = await fs.readdir(facilityDirectory);    
        let filePath;
        const file = readfiles.find((file) => {
          const fileName = file.replace(/\.[^/.]+$/, '')
          if (fileName === id) {
            filePath = `${facilityDirectory}/${file}`;
          }
        });
        const imageBuffer = fs.readFileSync(filePath);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename=image.png');
        res.send(imageBuffer);
      }
      catch (err) {
        console.log('err in catch', err)
      }
    }

    @Get('/get-footer-image')
    async getFooterImage(
      @Headers('Authorization') authHeader: string,
      @Res() res
    ): Promise<any> {
      try {
        const token = authHeader.split(' ')[1];
        const loggedInUser: any = jwtDecode(token);
        const facility: any = await this.facilityService.getSingleFacilityById(loggedInUser.facility_id);
        const laboratory = await this.laboratoriesService.getLabForSetting(facility?._id);
        const id = laboratory?.laboratory_id;
        const facilityDirectory = `src/common/uploads/laboratories/${id}/footer`;
        const readfiles = await fs.readdir(facilityDirectory);    
        let filePath;
        const file = readfiles.find((file) => {
          const fileName = file.replace(/\.[^/.]+$/, '')
          if (fileName === id) {
            filePath = `${facilityDirectory}/${file}`;
          }
        });
        const imageBuffer = fs.readFileSync(filePath);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename=image.png');
        res.send(imageBuffer);
      }
      catch (err) {
        console.log('err in catch', err)
      }
    }

}
