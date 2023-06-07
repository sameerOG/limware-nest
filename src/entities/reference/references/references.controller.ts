import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  Headers,
  Put,
} from '@nestjs/common';
import { ReferencesService } from './references.service';
import { response, Response } from 'express';
import {
  ReferencesCreateResponseDto,
  ReferencesListResponseDto,
} from './dto/response.dto';
import jwtDecode from 'jwt-decode';
import { ReferenceRequestDto } from './dto/request.dto';
@Controller('references')
export class ReferencesController {
  constructor(private readonly referencesService: ReferencesService) {}

  @Get('/')
  async findAll(
    @Res() response: Response,
    @Headers('Authorization') authHeader: string,
  ): Promise<ReferencesListResponseDto[]> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.referencesService.getAll(loggedInUser);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Reference not found' });
    }
  }
  @Post()
  async create(
    @Res() response: Response,
    @Body() body: ReferenceRequestDto,
    @Headers('Authorization') authHeader: string,
  ): Promise<ReferencesCreateResponseDto> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser: any = jwtDecode(token);
      Object.assign(body, { facility_id: loggedInUser.facility_id });
      const data = await this.referencesService.create(body);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'References not found' });
    }
  }

  @Put(':id')
  async update(
    @Res() response: Response,
    @Param('id') id,
    @Body() body: ReferenceRequestDto,
    @Headers('Authorization') authHeader: string,
  ): Promise<ReferencesCreateResponseDto> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser: any = jwtDecode(token);
      Object.assign(body, { facility_id: loggedInUser.facility_id });
      const data = await this.referencesService.update(id, body);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'References not updated' });
    }
  }

  @Get('/get-all')
  async getAll(
    @Res() response: Response,
    @Headers('Authorization') authHeader: string,
  ): Promise<ReferencesListResponseDto[]> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.referencesService.getAll(loggedInUser);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Reference not created' });
    }
  }

  @Get(':id')
  async findOne(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<ReferencesCreateResponseDto> {
    try {
      let data = await this.referencesService.findOne(id);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        response
          .status(422)
          .send({ error: true, message: 'Reference not found' });
      }
    } catch (err) {
      response.status(422).send({ error: err, message: 'Reference not found' });
    }
  }

  @Delete(':id')
  async remove(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<void> {
    try {
      await this.referencesService.remove(id);
      response.status(204).send('Reference deleted successfully');
    } catch (err) {
      response.status(422).send({ error: err, message: 'Reference not found' });
    }
  }
}
