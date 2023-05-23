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
import { FeaturesService } from './features.service';
import {
  AppFeatureResponseDto,
  SingleAppFeatureResponseDto,
} from './dto/response.dto';
import { FeatureRequestDto } from './dto/request.dto';

@Controller('')
export class FeaturesController {
  constructor(private featureService: FeaturesService) {}

  @Get('/feature-updates')
  async getAll(
    @Res() response: Response,
    @Query() query,
  ): Promise<AppFeatureResponseDto[]> {
    try {
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const sort = query['sort'];
      const text = query.filter?.title;
      const skip = (page - 1) * perpage;
      let data = await this.featureService.getAll(skip, perpage, text, sort);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Feature Updates not found' });
    }
  }

  @Get('/feature-updates/:id')
  async getSingle(
    @Res() response: Response,
    @Param('id') id,
  ): Promise<SingleAppFeatureResponseDto> {
    try {
      let data = await this.featureService.getSingle(id);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Feature update not found' });
    }
  }

  @Post('/feature-updates')
  async add(
    @Res() response: Response,
    @Body() body: FeatureRequestDto,
  ): Promise<SingleAppFeatureResponseDto> {
    try {
      let data = await this.featureService.add(body);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Feature Updates not added' });
    }
  }

  @Put('/feature-updates/:id')
  async update(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() body: FeatureRequestDto,
  ): Promise<SingleAppFeatureResponseDto> {
    try {
      let data = await this.featureService.update(id, body);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Feature Updated not updated' });
    }
  }

  @Delete('/feature-updates/:id')
  async delete(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<any> {
    try {
      let data = await this.featureService.delete(id);
      response.status(204).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Feature Updates not deleted' });
    }
  }
}
