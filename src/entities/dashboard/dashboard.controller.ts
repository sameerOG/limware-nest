import { Controller, Get, Headers, Inject, Query, Res, UseGuards } from "@nestjs/common";
import jwtDecode from "jwt-decode";
import { PatientListResponseDto } from "../patient/dto/response.dto";
import { PatientsService } from "../patient/patients/patients.service";
import { InvoicesService } from "../invoice/invoices/invoices.service";
import { AppointmentsService } from "../appointment/appointments/appointments.service";
import { AuthGuard } from "src/guard/auth.guard";

@Controller('limware-dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
    @Inject(PatientsService)
    private readonly patientService: PatientsService;
    @Inject(InvoicesService)
    private readonly invoiceService: InvoicesService;
    @Inject(AppointmentsService)
    private readonly appointmentService: AppointmentsService

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
            let patients: any = await this.patientService.getTodayPatients(
                loggedInUser,
                perpage,
                page,
                sort,
            );
            let patientsData: any = [];
            if (patients) {
                for (let i = 0; i < patients?.length; i++) {
                    const patient_id = patients[i]?._id;
                    const invoice = await this.invoiceService.todayDues(patient_id);
                    if (invoice[0] != undefined && invoice[0] != null) {
                        const object = {
                            age: patients[i]?.age,
                            age_unit: patients[i]?.age_unit,
                            cc_facility_id: patients[i]?.facility_id,
                            due_amount: invoice[0]?.due_amount ? invoice[0]?.due_amount : 0,
                            from_cc: patients[i]?.from_cc,
                            gender: patients[i]?.gender,
                            invoice_status: invoice[0]?.status ? invoice[0]?.status : null,
                            is_completed: patients[i]?.is_completed,
                            lab_number: patients[i]?.lab_number ? patients[i]?.lab_number : '0001'  ,
                            mobile_number: patients[i]?.mobile_number,
                            name: patients[i]?.name,
                            registration_date: patients[i]?.registration_date,
                            unique_id: patients[i]?.unique_id,
                            _id: patients[i]?._id
                        }
                        patientsData.push(object);
                    }
                }
            }
            response.status(200).send(patientsData);
            return patients;
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
            let sales = [];
            for (let i = 0; i < patients?.length; i++) {
                const patientId = patients[i]?._id;
                const patient = await this.invoiceService.todaySales(patientId);
                if (patient[0]?.paid_amount != undefined && patient[0]?.paid_amount != undefined) {
                    sales.push(Number(patient[0]?.paid_amount));
                }
            }
            const sum = sales.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            const obj = { today: `${sum}` }
            response.status(200).send(obj);
            return 'data';
        } catch (err) {
            console.log('err in catch', err);
            response.status(422).send({ error: err, message: 'today sales not found' });
        }

    }
    @Get('today-dues')
    async getTodayDues(
        @Res() response,
        @Headers('Authorization') authHeader: string,
    ) {
        try {
            const token = authHeader.split(' ')[1];
            const loggedInUser = jwtDecode(token);
            let patients: any = await this.patientService.getTodayPatientCount(loggedInUser);
            let sales = [];
            for (let i = 0; i < patients?.length; i++) {
                const patientId = patients[i]?._id;
                const patient = await this.invoiceService.todayDues(patientId);
                if (patient[0]?.due_amount != undefined && patient[0]?.due_amount != undefined) {
                    sales.push(Number(patient[0]?.due_amount));
                }
            }
            const sum = sales.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            const obj = {
                conversion: { value: `${sum}` }
            }
            response.status(200).send(obj);
            return 'data';
        } catch (err) {
            console.log('err in catch', err);
            response.status(422).send({ error: err, message: 'Today dues not found' });
        }

    }
    @Get('today-pending-patients-count')
    async todayPendingPatientsCount(
        @Res() response,
        @Headers('Authorization') authHeader: string,
    ) {
        try {
            const token = authHeader.split(' ')[1];
            const loggedInUser = jwtDecode(token);
            let patients: any = await this.patientService.getTodayPatientCount(loggedInUser);
            let pending = [];
            for (let i = 0; i < patients?.length; i++) {
                const patientId = patients[i]?._id;
                const patient = await this.appointmentService.todayPendingPatients(patientId);
                if (patient && patient[0] != undefined && patient[0] != null) {
                    pending.push(patient[0]);
                }
            }
            const obj = {
                conversion: { value: pending?.length }
            }
            response.status(200).send(obj);
            return obj;
        } catch (err) {
            console.log('err in catch', err);
            response.status(422).send({ error: err, message: 'Today dues not found' });
        }

    }

}