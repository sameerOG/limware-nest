import {
  Controller,
  Get,
  Res,
  Headers,
  Post,
  Body,
  HttpException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { query, Response } from 'express';
import jwtDecode from 'jwt-decode';
import { AuthGuard } from 'src/guard/auth.guard';
import {
  AddAppointmentRequestDto,
  AddTestDto,
  DeleteTestDto,
  SearchPatientRequest,
} from '../dto/request.dto';
import {
  AddAppointmentResponseDto,
  GetAllReferences,
  GetAllTests,
  PatientTestForDeleteResponseDto,
  SearchPatient,
} from '../dto/response.dto';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
@UseGuards(AuthGuard)
export class AppointmentsController {
  constructor(private appointmentService: AppointmentsService) {}

  @Get('/get-all-tests')
  async getAllTests(
    @Res() response: Response,
    @Headers('Authorization') authHeader: string,
  ): Promise<GetAllTests[]> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.appointmentService.getAllTests(loggedInUser);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Tests not found' });
    }
  }

  @Get('/get-patient-completed-test-for-delete')
  async getPatientCompletedTestForDelete(
    @Res() response: Response,
    @Query() query,
  ): Promise<PatientTestForDeleteResponseDto> {
    try {
      let patient_test_id = query['patient_test_id'];
      let invoice_id = query['invoice_id'];
      let data = await this.appointmentService.getPatientCompletedTestForDelete(
        patient_test_id,
        invoice_id,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Patient Test not found' });
    }
  }

  @Get('/get-all-references')
  async getAllReferences(
    @Res() response: Response,
    @Headers('Authorization') authHeader: string,
  ): Promise<GetAllReferences[]> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.appointmentService.getAllReferences(loggedInUser);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'References not found' });
    }
  }

  @Post('/search-patient')
  async searchPatient(
    @Res() response: Response,
    @Body() body: SearchPatientRequest,
    @Headers('Authorization') authHeader: string,
  ): Promise<SearchPatient> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.appointmentService.searchPatient(
        loggedInUser,
        body,
      );
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Patient not found' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Patient not found' });
    }
  }

  @Post('/')
  async addAppointment(
    @Res() response: Response,
    @Body() body: AddAppointmentRequestDto,
    @Headers('Authorization') authHeader: string,
  ): Promise<AddAppointmentResponseDto> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.appointmentService.add(body, loggedInUser);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Appointment not saved' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Patient not found' });
    }
  }

  @Post('/add-tests')
  async addTest(
    @Res() response: Response,
    @Body() body: AddTestDto,
    @Headers('Authorization') authHeader: string,
  ): Promise<boolean> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.appointmentService.addTest(body, loggedInUser);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Tests not added' });
    }
  }

  @Get('/get-patient-test-for-delete')
  async getPatientTestForDelete(
    @Res() response: Response,
    @Query() query,
  ): Promise<PatientTestForDeleteResponseDto> {
    try {
      let patient_test_id = query['patient_test_id'];
      let invoice_id = query['invoice_id'];
      let data = await this.appointmentService.getPatientTestForDelete(
        patient_test_id,
        invoice_id,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Patient Test not found' });
    }
  }

  @Post('/delete-test')
  async deleteTest(
    @Res() response: Response,
    @Body() body: DeleteTestDto,
    @Headers('Authorization') authHeader: string,
  ): Promise<boolean> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.appointmentService.deletTest(body, loggedInUser);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Patient Test not deleted' });
    }
  }

  @Post('/delete-completed-test')
  async deleteCompletedTest(
    @Res() response: Response,
    @Body() body: DeleteTestDto,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.appointmentService.deleteCompletedTest(
        body,
        loggedInUser,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Patient Test not deleted' });
    }
  }
}
