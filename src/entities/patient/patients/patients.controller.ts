import {
  Controller,
  Get,
  Query,
  Res,
  Headers,
  Param,
  HttpException,
  Body,
  Put,
} from '@nestjs/common';
import { Response } from 'express';
import jwtDecode from 'jwt-decode';
import { UpdatePatientRequestDto } from '../dto/request.dto';
import {
  PatientInfoResponseDto,
  PatientListResponseDto,
} from '../dto/response.dto';
import { Patient } from '../patient.entity';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private patientService: PatientsService) {}

  @Get('/')
  async getAll(
    @Res() response: Response,
    @Query() query,
    @Headers('Authorization') authHeader: string,
  ): Promise<PatientListResponseDto[]> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const sort = query['sort'];
      const filter = query.filter;
      const skip = (page - 1) * perpage;
      let data = await this.patientService.getAll(
        loggedInUser,
        skip,
        perpage,
        page,
        filter,
        sort,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Patients not found' });
    }
  }

  @Get('/:id')
  async getSingle(
    @Res() response: Response,
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ): Promise<PatientInfoResponseDto> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.patientService.getSingle(id, loggedInUser);
      response.status(200).send(data);
      if (data) {
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

  @Put('/:id')
  async update(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() body: UpdatePatientRequestDto,
    @Headers('Authorization') authHeader: string,
  ): Promise<Patient> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.patientService.update(id, body, loggedInUser);
      response.status(200).send(data);
      if (data) {
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Patient not updated' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Patient not updated' });
    }
  }
}
