import { Controller, Get, Res, Headers, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import jwtDecode from 'jwt-decode';
import { AddAppointment, SearchPatientRequest } from '../dto/request.dto';
import {
  GetAllReferences,
  GetAllTests,
  SearchPatient,
} from '../dto/response.dto';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
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
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        response.status(422).send({});
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
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
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        response.status(422).send({});
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
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
        response.status(422).send({});
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send(err);
    }
  }
}