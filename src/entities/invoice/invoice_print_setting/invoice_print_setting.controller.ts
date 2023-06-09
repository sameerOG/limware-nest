import { Body, Controller, Get, Headers, Inject, Post, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import jwtDecode from "jwt-decode";
import { AuthGuard } from "src/guard/auth.guard";
import { FacilitiesService } from "../../Facility/facilities/facilities.service";
import { LaboratoriesService } from "../../laboratory/laboratories/laboratories.service";
import { DirectoryManagerService } from "src/shared/DirectoryManagerService";
import { FileInterceptor } from "@nestjs/platform-express";
import * as fs from 'fs-extra';
import { InvoicePrintSettingsSerive } from "./report_print_setting.service";

@Controller('invoice-print-settings')
@UseGuards(AuthGuard)
export class InvoicePrintSettingsController {
    @Inject(InvoicePrintSettingsSerive)
    private readonly invoicePrintService: InvoicePrintSettingsSerive;
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
            const InvoicePrintSettings = await this.invoicePrintService.getReportPrintSettings(laboratory?._id);
            response.status(200).send(InvoicePrintSettings);
            return InvoicePrintSettings;
        } catch (err) {
            console.log('err in catch', err);
            response.status(400).send({ error: err, message: 'margins not found' });
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
            const InvoicePrintSettings = await this.invoicePrintService.saveFooterText(laboratory?.laboratory_id, body);
            response.status(200).send(InvoicePrintSettings);
            return InvoicePrintSettings;
        } catch (err) {
            console.log('err in catch', err);
            response.status(400).send({ error: err, message: 'Settings not change' });
        }

    }
    @Post('/save-logo-image')
    @UseInterceptors(FileInterceptor('logo_image_file'))
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
                const type = 'invoices';
                const name = laboratory?._id;
                const position = 'logo';
                const obj = {
                    type: type,
                    name: name,
                    position: position,
                    file: file
                }
                const logo_image_name = await this.directoryManagerService.uploadFile(obj);
                const reportPrintSetting = await this.invoicePrintService.saveLogoImage(laboratory?.laboratory_id, logo_image_name);
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
    @Get('/get-logo-image')
    async getHeaderImage(
      @Headers('Authorization') authHeader: string,
      @Res() res
    ): Promise<any> {
      try {
        const token = authHeader.split(' ')[1];
        const loggedInUser: any = jwtDecode(token);
        const facility: any = await this.facilityService.getSingleFacilityById(loggedInUser.facility_id);
        const laboratory = await this.laboratoriesService.getLabForSetting(facility?._id);
        const id = laboratory?._id;
        const facilityDirectory = `src/common/uploads/invoices/${id}/logo`;
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
