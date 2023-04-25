import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AddonsService } from './addons.service';
import { Response } from 'express';
import {
  AddonDto,
  AddonRequestDto,
  SMS_AND_WHATSAPP_SETTINGS,
} from '../dto/response.dto';
import { AddonsRequest } from '../dto/request.dto';
@Controller('addons')
export class AddonsController {
  constructor(private addonsService: AddonsService) {}

  @Get('/get-by-facility')
  async getAllByFacility(
    @Res() response: Response,
    @Query() query,
  ): Promise<AddonDto> {
    try {
      const facility_id: string = query['facility_id'];
      const data = await this.addonsService.getAllByFacility(facility_id);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send([]);
    }
  }

  @Post('/update-addons-settings')
  async updateAddons(
    @Res() response: Response,
    @Query() query,
    @Body() body: AddonsRequest,
  ): Promise<AddonDto> {
    try {
      const facility_id: string = query['facility_id'];
      const data = await this.addonsService.update(facility_id, body);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send([]);
    }
  }
}
