import { Controller, Get, Headers, Inject, Query, Res } from "@nestjs/common";
import jwtDecode from "jwt-decode";
import { PatientListResponseDto } from "../patient/dto/response.dto";
import { PatientsService } from "../patient/patients/patients.service";

@Controller('limware-dashboard')
export class DashboardController {
    @Inject(PatientsService)
    private readonly patientService: PatientsService;

    constructor() { }

    @Get('today-patients-list')
    async getAll(
        @Res() response,
        @Query() query,
        @Headers('Authorization') authHeader: string,
    ): Promise<PatientListResponseDto[]> {
        try {
            const token = authHeader.split(' ')[1];
            const loggedInUser = jwtDecode(token);
            const perpage = query['per-page'] ? query['per-page'] : 25;
            const page = query['page'] ? query['page'] : 1;
            const sort = query['sort'];
            let data: any = await this.patientService.getTodayPatients(
                loggedInUser,
                perpage,
                page,
                sort,
            );
            response.status(200).send(data);
            return data;
        } catch (err) {
            console.log('err in catch', err);
            response.status(422).send({ error: err, message: 'Patients not found' });
        }
    }
    @Get('today-patients-count')
    async getTodayPatients(
        @Res() response,
        @Headers('Authorization') authHeader: string,
    ) {
        try {
            const token = authHeader.split(' ')[1];
            const loggedInUser = jwtDecode(token);
            let data: any = await this.patientService.getTodayPatientCount(loggedInUser);
            const obj = {
                conversion: {
                    value: data?.length
                }
            }
            response.status(200).send(obj);
            return 'data';
        } catch (err) {
            console.log('err in catch', err);
            response.status(422).send({ error: err, message: 'Patients count not found' });
        }

    }

    @Get('today-sales')
    async getTodaySales(
        @Res() response,
        @Headers('Authorization') authHeader: string,
    ) {
        try {
            const token = authHeader.split(' ')[1];
            const loggedInUser = jwtDecode(token);
            let patients: any = await this.patientService.getTodayPatientCount(loggedInUser);
            response.status(200).send(patients);
            return 'data';
        } catch (err) {
            console.log('err in catch', err);
            response.status(422).send({ error: err, message: 'Patients count not found' });
        }

    }


}