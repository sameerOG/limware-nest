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
      const text = query.filter?.name;
      const skip = (page - 1) * perpage;

      let data = await this.labService.getAll(skip, perpage, text);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send([]);
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
      response.status(400).send([]);
    }
  }

  @Get('/:id')
  async getSingle(
    @Res() response: Response,
    @Param('id') id: string,
    @Query() query,
  ): Promise<LabRequestDto> {
    try {
      const queryFields = query?.expand?.split(',');
      let data = await this.labService.getSingle(id, queryFields);
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
    @Body() body: LaboratoryRequestDto,
  ): Promise<LabRequestDto> {
    try {
      let data = await this.labService.add(body);
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
        response.status(422).send({});
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
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
        response.status(422).send({});
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
    }
  }
}
