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
import { DepartmentsService } from './departments.service';
import { Response } from 'express';
import { DepartmentDto } from '../dto/response.dto';
import { DepartmentRequest, EditDepartmentRequest } from '../dto/request.dto';
import { AuthGuard } from 'src/guard/auth.guard';
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
      response.status(400).send([]);
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
      response.status(400).send([]);
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
        response.status(400).send({});
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send({});
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
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        response.status(400).send([]);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send({});
    }
  }

  @Delete('/:id')
  async delete(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Object> {
    try {
      let data = await this.departmentService.delete(id);
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
