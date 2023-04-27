import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Response } from 'express';
import { EmployeeResponseDto } from '../dto/response.dto';
import { EmployeeRequestDto } from '../dto/request.dto';
import { AuthGuard } from 'src/guard/auth.guard';
@Controller('')
@UseGuards(AuthGuard)
export class EmployeesController {
  constructor(private empService: EmployeesService) {}

  @Get('/employees')
  async getAll(
    @Res() response: Response,
    @Query() query,
  ): Promise<EmployeeResponseDto[]> {
    try {
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const text = query.filter?.name;
      const skip = (page - 1) * perpage;

      let data = await this.empService.getAll(skip, perpage, text);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send([]);
    }
  }

  @Get('/employees/get-by-facility')
  async getAllByFacilit(
    @Res() response: Response,
    @Query() query,
  ): Promise<EmployeeResponseDto[]> {
    try {
      const facility_id = query['facility_id'];

      let data = await this.empService.getAllByFacility(facility_id);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send([]);
    }
  }

  @Get('/employees/:id')
  async getSingle(
    @Res() response: Response,
    @Param('id') id,
  ): Promise<EmployeeResponseDto> {
    try {
      let data = await this.empService.getSingle(id);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send([]);
    }
  }

  @Get('/employees-facilities/get-by-employee')
  async getSingleByEmployee(
    @Res() response: Response,
    @Query() query,
  ): Promise<EmployeeResponseDto> {
    try {
      const id = query['id'];
      let data = await this.empService.getSingle(id);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send([]);
    }
  }

  @Post('/employees')
  async add(
    @Res() response: Response,
    @Body() body: EmployeeRequestDto,
  ): Promise<EmployeeResponseDto> {
    try {
      let data = await this.empService.add(body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        response.status(400).send({});
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send({});
    }
  }

  @Put('/employees/:id')
  async update(
    @Res() response: Response,
    @Body() body: EmployeeRequestDto,
    @Param('id') id: string,
  ): Promise<EmployeeResponseDto> {
    try {
      let data = await this.empService.update(id, body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        response.status(400).send({});
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send({});
    }
  }

  @Delete('/employees/:id')
  async delete(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<any> {
    try {
      let data = await this.empService.delete(id);
      if (data.affected > 0) {
        response.status(200).send(data);
        return data;
      } else {
        response.status(400).send({});
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send({});
    }
  }
}
