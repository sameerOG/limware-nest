import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
  Headers
} from '@nestjs/common';
import { AddonsService } from './addons.service';
import { Response } from 'express';
import {
  AddonDto
} from '../dto/response.dto';
import { AddonsRequest } from '../dto/request.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import jwtDecode from 'jwt-decode';
import { FacilitiesService } from 'src/entities/Facility/facilities/facilities.service';
@Controller('addons')
@UseGuards(AuthGuard)
export class AddonsController {
  constructor(private addonsService: AddonsService, private facilityService: FacilitiesService) { }

  @Get('/get-my-addons')
  async getAddons(
    @Res() response,
    @Headers('Authorization') authHeader: string,
  ) {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser: any = jwtDecode(token);
      const facility = await this.facilityService.getSingleFacilityById(loggedInUser?.facility_id);
      const addons = await this.addonsService.getMyAddOns(facility._id);
      response.status(200).send(addons);
      return addons;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Addons not found' });
    }
  }
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
      response
        .status(422)
        .send({ error: err, message: 'Facilities not found' });
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
      response.status(422).send({ error: err, message: 'Addons not Updated' });
    }
  }

}
