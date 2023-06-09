import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import { PricingPlanRequestDto } from '../dto/request.dto';
import { PricingPlanResponseDto } from '../dto/response.dto';
import { PricingPlansService } from './pricing-plans.service';

@Controller('pricing-plans')
@UseGuards(AuthGuard)
export class PricingPlansController {
  constructor(private pricingPlanService: PricingPlansService) {}

  @Get('/')
  async getAll(
    @Res() response: Response,
    @Query() query,
  ): Promise<PricingPlanResponseDto[]> {
    try {
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const sort = query['sort'];
      const text = query.filter?.title;
      const skip = (page - 1) * perpage;
      let data = await this.pricingPlanService.getAll(
        skip,
        perpage,
        text,
        sort,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Pricing Plans not found' });
    }
  }

  @Get('/:id')
  async getSingle(
    @Res() response: Response,
    @Param('id') id,
  ): Promise<PricingPlanResponseDto> {
    try {
      let data = await this.pricingPlanService.getSingle(id);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Pricing Plan not found' });
    }
  }

  @Post('/')
  async add(
    @Res() response: Response,
    @Body() body: PricingPlanRequestDto,
  ): Promise<PricingPlanResponseDto> {
    try {
      let data = await this.pricingPlanService.add(body);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Pricing Plan not added' });
    }
  }

  @Delete('/:id')
  async delete(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<PricingPlanResponseDto> {
    try {
      let data = await this.pricingPlanService.delete(id);
      response.status(204).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Pricing Plan not deleted' });
    }
  }
}
