import {
  Body,
  Controller,
  Param,
  Put,
  Res,
  Headers,
  HttpException,
  Query,
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
}
