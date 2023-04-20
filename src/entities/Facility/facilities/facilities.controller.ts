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
} from '@nestjs/common';
import { Response } from 'express';
import { FacilityRequestDto } from '../dto/request.dto';
import { FacilityDto } from '../dto/response.dto';
import { FacilitiesService } from './facilities.service';

@Controller('facilities')
export class FacilitiesController {
  constructor(private facilityService: FacilitiesService) {}

  @Get('/')
  async getAll(
    @Res() response: Response,
    @Query() query,
  ): Promise<FacilityDto[]> {
    try {
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const text = query.filter?.name;
      const skip = (page - 1) * perpage;

      let data = await this.facilityService.getAll(skip, perpage, text);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send([]);
    }
  }

  @Get('/get-by-customer')
  async getAllByCustomer(
    @Res() response: Response,
    @Query() query,
  ): Promise<FacilityDto[]> {
    try {
      const customer_id: string = query['customer_id'];
      const data = await this.facilityService.getAllByCustomer(customer_id);
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
    @Param('id') id,
    @Query() query,
  ): Promise<any> {
    try {
      const queryFields = query.expand.split(',');
      let data = await this.facilityService.getSingle(id, queryFields);
      response.status(200).send(data);
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send({});
    }
  }

  @Post('/')
  async add(
    @Res() response: Response,
    @Body() body: FacilityRequestDto,
  ): Promise<FacilityDto> {
    try {
      let data = await this.facilityService.add(body);
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
    @Body() body: FacilityRequestDto,
    @Param('id') id: string,
  ): Promise<FacilityDto> {
    try {
      let data = await this.facilityService.update(id, body);
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
  ): Promise<any> {
    try {
      let data = await this.facilityService.delete(id);
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
