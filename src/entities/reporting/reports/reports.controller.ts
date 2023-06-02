import { Body, Controller, Post, Headers, Res } from '@nestjs/common';
import { Response } from 'express';
import jwtDecode from 'jwt-decode';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private patientService: ReportsService) {}

  @Post('/get-patient-count-report')
  async getPatientCountReport(
    @Res() response: Response,
    @Body() body,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.patientService.getPatientCountReport(
        body,
        loggedInUser,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Report not found' });
    }
  }

  @Post('/print-patient-count-report')
  async printPatientCountReport(
    @Res() response: Response,
    @Body() body,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.patientService.printPatientCountReport(
        body,
        loggedInUser,
      );
      response.setHeader('Content-Type', 'application/pdf');
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Report not found' });
    }
  }

  @Post('/get-patient-daily-count-report')
  async getPatientDailyCountReport(
    @Res() response: Response,
    @Body() body,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.patientService.getPatientDailyCountReport(
        body,
        loggedInUser,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Report not found' });
    }
  }

  @Post('/print-patient-daily-count-report')
  async printPatientDailyCountReport(
    @Res() response: Response,
    @Body() body,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.patientService.printPatientDailyCountReport(
        body,
        loggedInUser,
      );
      response.setHeader('Content-Type', 'application/pdf');
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Report not found' });
    }
  }

  @Post('/get-sales-report')
  async getSalesReport(
    @Res() response: Response,
    @Body() body,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.patientService.getSalesReport(body, loggedInUser);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Report not found' });
    }
  }

  @Post('/get-daily-sales-report')
  async getSalesDailyReport(
    @Res() response: Response,
    @Body() body,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.patientService.getSalesDailyReport(
        body,
        loggedInUser,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Report not found' });
    }
  }

  @Post('/print-daily-sales-report')
  async printSalesDailyReport(
    @Res() response: Response,
    @Body() body,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.patientService.printSalesDailyReport(
        body,
        loggedInUser,
      );
      response.setHeader('Content-Type', 'application/pdf');
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Report not found' });
    }
  }

  @Post('/print-sales-report')
  async printSalesReport(
    @Res() response: Response,
    @Body() body,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.patientService.printSalesReport(body, loggedInUser);
      response.setHeader('Content-Type', 'application/pdf');
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Report not found' });
    }
  }

  @Post('/get-due-payment-report')
  async getDuePaymentReport(
    @Res() response: Response,
    @Body() body,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.patientService.getDuePaymentReport(
        body,
        loggedInUser,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Report not found' });
    }
  }

  @Post('/print-due-payment-report')
  async printDuePaymentReport(
    @Res() response: Response,
    @Body() body,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.patientService.printDuePaymentReport(
        body,
        loggedInUser,
      );
      response.setHeader('Content-Type', 'application/pdf');
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Report not found' });
    }
  }
}
