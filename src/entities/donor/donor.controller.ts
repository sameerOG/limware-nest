import { Body, Controller, Delete, Get, Headers, Inject, Param, Post, Put, Query, Res, UseGuards } from "@nestjs/common";
import jwtDecode from "jwt-decode";
import { AuthGuard } from "src/guard/auth.guard";
import { LaboratoriesService } from "../laboratory/laboratories/laboratories.service";
import { DonorsService } from "./donoer.service";
import { PatientTestsService } from "../patient/patient-tests/patient-tests.service";
import { FacilitiesService } from "../Facility/facilities/facilities.service";
import { Donor } from "./donor.entity";

@Controller('donors')
@UseGuards(AuthGuard)
export class DonorsController {
    @Inject(LaboratoriesService)
    private readonly laboratoriesService: LaboratoriesService
    @Inject(DonorsService)
    private readonly donorService: DonorsService
    @Inject(PatientTestsService)
    private readonly patientTestService: PatientTestsService;
    @Inject(FacilitiesService)
    private readonly facilitiesService: FacilitiesService
    constructor() { }

    @Get('/search-by-mobile')
    async searchMobile(
        @Res() response,
        @Query() query,
        @Headers('Authorization') authHeader: string,
    ) {
        try {
            const token = authHeader.split(' ')[1];
            const loggedInUser: any = jwtDecode(token);
            const donor = await this.donorService.getByMobileNumber(query.getByMobileNumber, loggedInUser?.facility_id)
            response.status(200).send(donor);
            return donor;
        } catch (err) {
            console.log('err in catch', err);
            response.status(422).send({ error: err, message: 'no result found' });
        }

    }

    @Get('/')
    async getDonors(
        @Res() response,
        @Query() query,
        @Headers('Authorization') authHeader: string,
    ) {
        try { 
            const token = authHeader.split(' ')[1];
            const loggedInUser: any = jwtDecode(token);
            const facility = await this.facilitiesService.getSingleFacilityById(loggedInUser.facility_id);
            const donors: Donor[] = await this.donorService.getAll(query,facility?._id);
            response.status(200).send(donors);
            return donors;
        } catch (err) {
            console.log('err in catch', err);
            response.status(422).send({ error: err, message: 'donors not found' });
        }

    }

    @Get('/:id')
    async getById(
        @Param('id') id: string,
        @Res() response,
    ) {
        try {
            const donor = await this.donorService.getById(id);
            response.status(200).send(donor[0]);
            return donor[0];
        } catch (err) {
            console.log('err in catch', err);
            response.status(422).send({ error: err, message: 'donor not found' });
        }
    }

    @Put('/:id')
    async updateById(
        @Param('id') id: string,
        @Body() body,
        @Res() response,
    ) {
        try {
            const donor = await this.donorService.update(id, body);
            response.status(200).send(donor);
            return donor;
        } catch (err) {
            console.log('err in catch', err);
            response.status(422).send({ error: err, message: 'donor not found' });
        }

    }

    @Delete('/:id')
    async deleteById(
        @Param('id') id: string,
        @Res() response,
    ) {
        try {
            const donor = await this.donorService.delete(id);
            response.status(200).send({ message: 'Donor Deleted' });
            return donor;
        } catch (err) {
            console.log('err in catch', err);
            response.status(422).send({ error: err, message: 'donor not deleted' });
        }

    }

    @Post('assign-to-patient')
    async addDonor(
        @Res() response,
        @Body() body,
        @Headers('Authorization') authHeader: string,
    ) {
        try {
            const token = authHeader.split(' ')[1];
            const loggedInUser: any = jwtDecode(token);
            const laboratory = await this.laboratoriesService.getLab(loggedInUser?.facility_id);
            const moreConditions = {
                mobile_number: body?.mobile_number,
                facility_id: laboratory?.facility_id,
                laboratory_id: laboratory._id

            }
            let newDonor: any
            const donor = await this.donorService.findDonor(moreConditions);
            if (donor === null || undefined) {

                newDonor = await this.donorService.add(body, laboratory.facility_id, laboratory._id);
                response.status(200).send(newDonor);
                return newDonor;
            } else {
                response.status(200).send(donor);
                return donor;
            }
            // newDonor = await this.donorService.add(body,laboratory.facility_id, laboratory._id);
            // const patientTest = await this.patientTestService.getPatientByIdAndUpdate(body.patient_test_id, donor ? donor?._id : newDonor?._id)

        } catch (err) {
            console.log('err in catch', err);
            response
                .status(422)
                .send({ error: err, message: 'Donor not created' });
        }
    }
}