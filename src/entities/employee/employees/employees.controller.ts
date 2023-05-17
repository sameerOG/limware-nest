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
  Headers,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Response } from 'express';
import { EmployeeResponseDto } from '../dto/response.dto';
import {
  AssignFacilityRequestDto,
  EmployeeRequestDto,
} from '../dto/request.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import jwtDecode from 'jwt-decode';
import { EmployeeFacilityDepartment } from '../employee_facility_department.entity';
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
      response.status(422).send([]);
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
      response.status(422).send([]);
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
      response.status(422).send([]);
    }
  }

  @Post('/employees-facilities')
  async assignFacility(
    @Res() response: Response,
    @Body() body: AssignFacilityRequestDto,
  ): Promise<EmployeeFacilityDepartment> {
    try {
      console.log('yyy');
      let data = await this.empService.assignFacility(body);
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

  // @Get('/employees-facilities/get-by-employee')
  // async getSingleByEmployee(
  //   @Res() response: Response,
  //   @Query() query,
  // ): Promise<any> {
  //   try {
  //     const id = query['id'];
  //     let data = await this.empService.getSingle(id);
  //     response.status(200).send(data);
  //     return data;
  //   } catch (err) {
  //     console.log('err in catch', err);
  //     response.status(422).send([]);
  //   }
  // }

  @Get('/employees-facilities/get-by-employee')
  async getByEmployee(@Res() response: Response, @Query() query): Promise<any> {
    try {
      const id = query['employee_id'];
      let data = await this.empService.getByEmployee(id);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send([]);
    }
  }

  @Get('/employees-facilities/get-unassigned-facilities')
  async getUnassignedFacilities(
    @Res() response: Response,
    @Query() query,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const employee_id = query['employee_id'];
      let data = await this.empService.getUnassignedFacilities(
        employee_id,
        loggedInUser,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send([]);
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
        response.status(422).send({});
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
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
        response.status(422).send({});
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
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
        response.status(422).send({});
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
    }
  }
}
