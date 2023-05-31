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
  HttpException,
  HttpStatus,
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
    @Headers('Authorization') authHeader: string,
  ): Promise<EmployeeResponseDto[]> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const sort = query['sort'];
      const text = query.filter?.name;
      const skip = (page - 1) * perpage;

      let data = await this.empService.getAll(
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
        .send({ error: err, message: "Employee's not found" });
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
      response
        .status(422)
        .send({ error: err, message: "Employee's not found" });
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
      response.status(422).send({ error: err, message: 'Employee not found' });
    }
  }

  @Post('/employees-facilities')
  async assignFacility(
    @Res() response: Response,
    @Body() body: AssignFacilityRequestDto,
  ): Promise<EmployeeFacilityDepartment> {
    try {
      let data = await this.empService.assignFacility(body);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Fcility not assigned' });
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
      response
        .status(422)
        .send({ error: err, message: 'Facilities not found' });
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
      response
        .status(422)
        .send({ error: err, message: 'Facilities not found' });
    }
  }

  @Get('/employees-facilities/:id')
  async getEmployeeFacilities(
    @Res() response: Response,
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.empService.getEmployeeFacilities(id, loggedInUser);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Facilities not found' });
    }
  }

  @Put('/employees-facilities/:id')
  async updateEmployeeFacilities(
    @Res() response: Response,
    @Body() body: AssignFacilityRequestDto,
    @Param('id') id: string,
  ): Promise<any> {
    try {
      let data = await this.empService.assignFacility(body, id);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Facility not updated' });
    }
  }

  @Delete('/employees-facilities/:id')
  async deleteEmployeeFacilities(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<void> {
    try {
      let data = await this.empService.deleteEmployeeFacilities(id);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Facility not deleted' });
    }
  }

  @Post('/employees')
  async add(
    @Res() response: Response,
    @Body() body: EmployeeRequestDto,
    @Headers('Authorization') authHeader: string,
  ): Promise<EmployeeResponseDto> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.empService.add(body, loggedInUser);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Employee not added' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Employee not added' });
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
        throw new HttpException(
          { err: true, messages: 'Employee not updated' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Employee not updated' });
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
        throw new HttpException(
          { err: true, messages: 'Employee not deleted' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Employee not deleted' });
    }
  }
}
