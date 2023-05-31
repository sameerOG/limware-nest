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
  Headers,
  Res,
  UseGuards, UploadedFile,
  UseInterceptors
} from '@nestjs/common';

import { Response } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import { FacilityRequestDto } from '../dto/request.dto';
import { FacilityDto, ParentFacilityDto } from '../dto/response.dto';
import { FacilitiesService } from './facilities.service';
import jwtDecode from 'jwt-decode';
import { DirectoryManagerService } from 'src/shared/DirectoryManagerService';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs-extra';
import { join } from 'path';
import {Blob} from 'buffer'


@Controller('facilities')
@UseGuards(AuthGuard)
export class FacilitiesController {
  public facility_image_height = 64;
  constructor(private facilityService: FacilitiesService, private directoryManagerService: DirectoryManagerService) { }

  @Get('/')
  async getAll(
    @Res() response: Response,
    @Query() query,
  ): Promise<FacilityDto[]> {
    try {
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const sort = query['sort'];
      const text = query.filter?.name;
      const skip = (page - 1) * perpage;
      let data = await this.facilityService.getAll(skip, perpage, text, sort);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Facilities not found' });
    }
  }

  @Get('/get-parent-facilities')
  async getParentFacilities(
    @Res() response: Response,
    @Query() query,
  ): Promise<ParentFacilityDto[]> {
    try {
      const customer_id = query['customer_id'];
      let data = await this.facilityService.getParentFacilities(customer_id);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Parent Facilities not found' });
    }
  }

  @Get('/get-by-customer')
  async getAllByCustomer(
    @Res() response: Response,
    @Query() query,
  ): Promise<FacilityDto[]> {
    try {
      const customer_id: string = query['customer_id'];
      const data = await this.facilityService.getAllByCustomer(customer_id);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Facilities not found' });
    }
  }
  @Get('/view-facility-for-limware')
  async actionViewFacilityForLimware(
    @Headers('Authorization') authHeader: string,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const facility = await this.facilityService.getFacility(loggedInUser);
      response.status(200).send(facility);
      return facility;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Facilities not found' });
    }
  }



  @Post('/')
  async add(
    @Res() response: Response,
    @Body() body: FacilityRequestDto,
  ): Promise<FacilityDto> {
    try {
      let data = await this.facilityService.add(body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Facility not added' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Facility not added' });
    }
  }

  @Put('/:id')
  async update(
    @Res() response: Response,
    @Body() body: FacilityRequestDto,
    @Param('id') id: string,
  ): Promise<FacilityDto> {
    try {
      let data = await this.facilityService.update(id, body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Facility not updated' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Facility not updated' });
    }
  }

  @Delete('/:id')
  async delete(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<any> {
    try {
      let data = await this.facilityService.delete(id);
      if (data.affected > 0) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Facility not deleted' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Facility not deleted' });
    }
  }

  @Get('/get-facility-image')
  async getFacilityImage(
    @Headers('Authorization') authHeader: string,
    @Res() res
  ): Promise<any> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const model = await this.facilityService.getFacility(loggedInUser);
      const id = model?._id.toString();
      const facilityDirectory = `src/common/uploads/facility`;
      const readfiles = await fs.readdir(facilityDirectory);
      let filePath;
      const file = readfiles.find((file) => {
        const fileName = file.replace(/\.[^/.]+$/, '')
        if (fileName === id) {
          filePath = `${facilityDirectory}/${file}`;
        }
      });
      const imageBuffer = fs.readFileSync(filePath);
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', 'attachment; filename=image.png');
      res.send(imageBuffer);
    }
    catch (err) {
      console.log('err in catch', err)
    }
  }

  @Post('/update-facility-for-limware')
  @UseInterceptors(FileInterceptor('facility_image_file'))
  async updateFacility(
    @Body() body: any,
    @UploadedFile() file,
    @Res() response,
    @Headers('Authorization') authHeader: string,
  ) {
    try {
      const data = JSON.parse(body?.data)
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const facility = await this.facilityService.getFacility(loggedInUser);
      const type = 'facility';
      const name = String(facility._id);
      let pathFile;
      if (file) {
        pathFile = await this.directoryManagerService.uploadFile(file, type, name);
      }
      const facilityData = await this.facilityService.findAndUpdate(facility?.facility_id, data, pathFile);
      response.status(200).send({ message: 'Facility updated', data: facilityData })
      return facilityData;
    }
    catch (err) {
      console.log(err)
    }

  }
  @Get('/:id')
  async getSingle(
    @Res() response: Response,
    @Param('id') id: string,
    @Query() query,
  ): Promise<any> {
    try {
      const queryFields = query?.expand?.split(',');
      let data = await this.facilityService.getSingle(id, queryFields);
      response.status(200).send(data);
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Facility not found' });
    }
  }
}
