import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Response } from 'express';
import { DepartmentDto } from '../dto/response.dto';
import { DepartmentRequest, EditDepartmentRequest } from '../dto/request.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { Department } from '../department.entity';
@Controller('departments')
@UseGuards(AuthGuard)
export class DepartmentsController {
  constructor(private departmentService: DepartmentsService) {}

  @Get('/get-facility-departments')
  async getAll(
    @Res() response: Response,
    @Query() query,
  ): Promise<DepartmentDto[]> {
    try {
      const facility_id = query['facility_id'];
      const parent = query['parent'];
      const parent_id = query['parent_id'];

      let data = await this.departmentService.getAll(facility_id, parent_id);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Facility Departments not found' });
    }
  }

  @Get('/get-by-facility')
  async getByFacility(
    @Res() response: Response,
    @Query() query,
  ): Promise<Department[]> {
    try {
      const facility_id = query['facility_id'];

      let data = await this.departmentService.getByFacility(facility_id);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Facility not found' });
    }
  }

  @Get('/:id')
  async getSingle(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<DepartmentDto> {
    try {
      const data = await this.departmentService.getSingle(id);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Department not found' });
    }
  }

  @Post('/')
  async add(
    @Res() response: Response,
    @Body() body: DepartmentRequest,
  ): Promise<DepartmentDto> {
    try {
      let data = await this.departmentService.add(body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Department not added' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Department not added' });
    }
  }

  @Put('/:id')
  async update(
    @Res() response: Response,
    @Body() body: EditDepartmentRequest,
    @Param('id') id: string,
  ): Promise<DepartmentDto> {
    try {
      let data = await this.departmentService.update(id, body);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Department not updated' });
    }
  }

  @Delete('/:id')
  async delete(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Object> {
    try {
      let data = await this.departmentService.delete(id);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Department not deleted' });
    }
  }
}
