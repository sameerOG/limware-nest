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
import { OutgoingMailServersRequestDto } from '../dto/outgoing-mail-servers/request.dto';
import { OutgoingMailServersDto } from '../dto/outgoing-mail-servers/response.dto';
import { OutgoingMailServersService } from './outgoing-mail-servers.service';
@Controller('outgoing-mail-servers')
export class OutgoingMailServersController {
  constructor(private omsRep: OutgoingMailServersService) {}

  @Get('/')
  async getAll(
    @Res() response: Response,
    @Query() query,
  ): Promise<OutgoingMailServersDto[]> {
    try {
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const text = query.filter?.title;
      const skip = (page - 1) * perpage;

      let data = await this.omsRep.getAll(skip, perpage, text);
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
  ): Promise<OutgoingMailServersDto> {
    try {
      let data = await this.omsRep.getSingle(id);
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
    @Body() body: OutgoingMailServersRequestDto,
  ): Promise<OutgoingMailServersDto> {
    try {
      let data = await this.omsRep.add(body);
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
    @Body() body: OutgoingMailServersRequestDto,
    @Param('id') id: string,
  ): Promise<OutgoingMailServersDto> {
    try {
      let data = await this.omsRep.update(id, body);
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
      let data = await this.omsRep.delete(id);
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
