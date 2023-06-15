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
import { OutgoingMailServersRequestDto } from '../dto/outgoing-mail-servers/request.dto';
import { OutgoingMailServersDto } from '../dto/outgoing-mail-servers/response.dto';
import { OutgoingMailServersService } from './outgoing-mail-servers.service';
@Controller('')
@UseGuards(AuthGuard)
export class OutgoingMailServersController {
  constructor(private omsRep: OutgoingMailServersService) {}

  @Get('/outgoing-mail-servers')
  async getAll(
    @Res() response: Response,
    @Query() query,
  ): Promise<OutgoingMailServersDto[]> {
    try {
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const sort = query['sort'];
      const text = query.filter?.title;
      const skip = (page - 1) * perpage;

      let data = await this.omsRep.getAll(skip, perpage, text, sort);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Mail Servers not found' });
    }
  }

  @Get('/email-templates/get-all-outgoing-mail-servers')
  async getOutgoingMailServers(
    @Res() response: Response,
  ): Promise<OutgoingMailServersDto[]> {
    try {
      let data = await this.omsRep.getOutgoingMailServers();
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Mail Servers not found' });
    }
  }

  @Get('/outgoing-mail-servers/:id')
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
      response
        .status(422)
        .send({ error: err, message: 'Mail Server not found' });
    }
  }

  @Post('/outgoing-mail-servers')
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
        throw new HttpException(
          { err: true, messages: 'Mail Server not added' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send(
          err[0] && err[0].field
            ? err
            : { error: err, message: 'Customer not updated' },
        );
    }
  }

  @Put('/outgoing-mail-servers/:id')
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
        throw new HttpException(
          { err: true, messages: 'Mail Server not updated' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send(
          err[0] && err[0].field
            ? err
            : { error: err, message: 'Customer not updated' },
        );
    }
  }

  @Delete('/outgoing-mail-servers/:id')
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
        throw new HttpException(
          { err: true, messages: 'Mail Server not deleted' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Mail Server not deleted' });
    }
  }
}
