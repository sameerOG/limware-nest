import {
  Body,
  Controller,
  Param,
  Put,
  Res,
  Headers,
  HttpException,
  Query,
  Get,
} from '@nestjs/common';
import { PatientTestsService } from './patient-tests.service';
import { Response } from 'express';
import { UpdatePatientTestStatusRequestDto } from '../dto/request.dto';
import jwtDecode from 'jwt-decode';
@Controller('patient-tests')
export class PatientTestsController {
  constructor(private patientTestService: PatientTestsService) {}

  @Put('/:id')
  async updateStatus(
    @Res() response: Response,
    @Query() query,
    @Body() body: UpdatePatientTestStatusRequestDto,
  ): Promise<any> {
    try {
      const id = query['_id'];
      let data = await this.patientTestService.updateStatus(id, body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Patient Test not updated' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Patient not updated' });
    }
  }

  @Get('/')
  async getAssignedPatients(
    @Res() response: Response,
    @Query() query,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const sort = query['sort'];
      const text = query.filter;
      const skip = (page - 1) * perpage;

      let data = await this.patientTestService.getPatientTests(
        loggedInUser,
        skip,
        perpage,
        text,
        sort,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Assigned Tests not found' });
    }
  }
}
