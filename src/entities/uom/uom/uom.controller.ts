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
import { SingleUomDto, UomDto } from '../dto/response.dto';
import { UomService } from './uom.service';
import { Response } from 'express';
import { UomRequestDto } from '../dto/request.dto';
import { AuthGuard } from 'src/guard/auth.guard';
@Controller('uom')
@UseGuards(AuthGuard)
export class UomController {
  constructor(private uomService: UomService) {}

  @Get('/')
  async getAll(@Res() response: Response, @Query() query): Promise<UomDto[]> {
    try {
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const sort = query['sort'];
      const text = query.filter?.name;
      const skip = (page - 1) * perpage;

      let data = await this.uomService.getAll(skip, perpage, text, sort);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: "Uom's not found" });
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
      response.status(422).send({ error: err, message: "Uom's not found" });
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
        throw new HttpException({ err: true, messages: 'Uom not added' }, 422);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Uom not added' });
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
        throw new HttpException(
          { err: true, messages: 'Uom not updated' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Uom not updated' });
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
        throw new HttpException(
          { err: true, messages: 'Uom not deleted' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Uom not deleted' });
    }
  }
}
