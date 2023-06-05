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
import { Response } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import { FacilityRequestDto } from '../dto/request.dto';
import { FacilityDto, ParentFacilityDto } from '../dto/response.dto';
import { FacilitiesService } from './facilities.service';

@Controller('facilities')
@UseGuards(AuthGuard)
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
      const sort = query['sort'];
      const text = query.filter?.name;
      const skip = (page - 1) * perpage;
      let data = await this.facilityService.getAll(skip, perpage, text, sort);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Facilities not found' });
    }
  }

  @Get('/get-parent-facilities')
  async getParentFacilities(
    @Res() response: Response,
    @Query() query,
  ): Promise<ParentFacilityDto[]> {
    try {
      const customer_id = query['customer_id'];
      let data = await this.facilityService.getParentFacilities(customer_id);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Parent Facilities not found' });
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
      response
        .status(422)
        .send({ error: err, message: 'Facilities not found' });
    }
  }

  @Get('/:id')
  async getSingle(
    @Res() response: Response,
    @Param('id') id: string,
    @Query() query,
  ): Promise<any> {
    try {
      const queryFields = query?.expand?.split(',');
      let data = await this.facilityService.getSingle(id, queryFields);
      response.status(200).send(data);
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Facility not found' });
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
        throw new HttpException(
          { err: true, messages: 'Facility not added' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Facility not added' });
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
        throw new HttpException(
          { err: true, messages: 'Facility not updated' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Facility not updated' });
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
        throw new HttpException(
          { err: true, messages: 'Facility not deleted' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Facility not deleted' });
    }
  }
}
