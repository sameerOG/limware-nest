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
import { LaboratoryRequestDto } from '../dto/request.dto';
import { LabRequestDto, LabResponseDto } from '../dto/response.dto';
import { LaboratoriesService } from './laboratories.service';

@Controller('laboratories')
@UseGuards(AuthGuard)
export class LaboratoriesController {
  constructor(private labService: LaboratoriesService) {}

  @Get('/')
  async getAll(
    @Res() response: Response,
    @Query() query,
  ): Promise<LabResponseDto[]> {
    try {
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const sort = query['sort'];
      const text = query.filter?.name;
      const skip = (page - 1) * perpage;

      let data = await this.labService.getAll(skip, perpage, text, sort);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(400)
        .send({ error: err, message: 'Laboratories not found' });
    }
  }

  @Get('/get-main-labs')
  async getMainLab(
    @Res() response: Response,
    @Query() query,
  ): Promise<LabResponseDto[]> {
    try {
      const customer_id: string = query['customer_id'];

      let data = await this.labService.getMainLab(customer_id);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send({ error: err, message: 'Labs not found' });
    }
  }

  @Get('/:id') // getByCustomer api & get By id APi both handled in this
  async getSingle(
    @Res() response: Response,
    @Param('id') id: string,
    @Query() query,
  ): Promise<any> {
    try {
      const queryFields = query?.expand?.split(',');
      const customer_id = query['customer_id'];
      let data;
      if (customer_id) {
        data = await this.labService.getByCustomer(customer_id);
      } else {
        data = await this.labService.getSingle(id, queryFields);
      }
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(403).send({ error: err, message: 'Lab not found' });
    }
  }

  @Post('/')
  async add(
    @Res() response: Response,
    @Body() body: LaboratoryRequestDto,
  ): Promise<LabRequestDto> {
    try {
      let data = await this.labService.add(body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException({ err: true, messages: 'Lab not added' }, 422);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Lab not added' });
    }
  }

  @Put('/:id')
  async update(
    @Res() response: Response,
    @Body() body: LaboratoryRequestDto,
    @Param('id') id: string,
  ): Promise<LabRequestDto> {
    try {
      let data = await this.labService.update(id, body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Lab not updated' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Lab not updated' });
    }
  }

  @Delete('/:id')
  async delete(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<any> {
    try {
      let data = await this.labService.delete(id);
      if (data.affected > 0) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Lab not deleted' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Lab not deleted' });
    }
  }
}
