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
import { SingleUomDto, UomDto } from '../dto/response.dto';
import { UomService } from './uom.service';
import { Response } from 'express';
import { UomRequestDto } from '../dto/request.dto';
@Controller('uom')
export class UomController {
  constructor(private uomService: UomService) {}

  @Get('/')
  async getAll(@Res() response: Response, @Query() query): Promise<UomDto[]> {
    try {
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const text = query.filter?.name;
      const skip = (page - 1) * perpage;

      let data = await this.uomService.getAll(skip, perpage, text);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send([]);
    }
  }

  @Get('/get-all')
  async getAllComplete(@Res() response: Response): Promise<UomDto[]> {
    try {
      let data = await this.uomService.getAllComplete();
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
    @Body() body: UomRequestDto,
  ): Promise<SingleUomDto> {
    try {
      let data = await this.uomService.add(body);
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
    @Body() body: UomRequestDto,
    @Param('id') id: string,
  ): Promise<SingleUomDto> {
    try {
      let data = await this.uomService.update(id, body);
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
      let data = await this.uomService.delete(id);
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
