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
import { SpecimenRequestDto } from '../dto/request.dto';
import { SingleSpecimenDto, SpecimenDto } from '../dto/response.dto';
import { SpecimensService } from './specimens.service';

@Controller('specimens')
@UseGuards(AuthGuard)
export class SpecimensController {
  constructor(private specimenService: SpecimensService) {}

  @Get('/')
  async getSpecimens(
    @Res() response: Response,
    @Query() query,
  ): Promise<SpecimenDto[]> {
    try {
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const text = query.filter?.name;
      const skip = (page - 1) * perpage;

      let data = await this.specimenService.getSpecimens(skip, perpage, text);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send([]);
    }
  }

  @Get('/get-all')
  async getAll(@Res() response: Response): Promise<SpecimenDto[]> {
    try {
      let data = await this.specimenService.getAll();
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send([]);
    }
  }

  @Put('/:id')
  async update(
    @Res() response: Response,
    @Body() body: SpecimenRequestDto,
    @Param('id') id,
  ): Promise<SingleSpecimenDto> {
    try {
      let data = await this.specimenService.updateSpecimen(id, body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        response.status(422).send([]);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
    }
  }

  @Post('/')
  async add(
    @Res() response: Response,
    @Body() body: SpecimenRequestDto,
  ): Promise<SingleSpecimenDto> {
    try {
      let data = await this.specimenService.addSpecimen(body);
      console.log('data', data);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        response.status(422).send([]);
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
      let data = await this.specimenService.deleteSpecimen(id);
      if (data.affected > 0) {
        response.status(204).send('Specimen deleted successfully');
      } else {
        response.status(422).send([]);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
    }
  }
}
