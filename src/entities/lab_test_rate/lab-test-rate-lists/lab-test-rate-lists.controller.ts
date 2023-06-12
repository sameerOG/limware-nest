import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Res,
  HttpException,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import jwtDecode from 'jwt-decode';
import { AuthGuard } from 'src/guard/auth.guard';
import { LabTestRateListRequestDto } from './dto/request.dto';
import {
  GetAllTestsResponseDto,
  RateListCreateResponseDto,
  RateListResponseDto,
} from './dto/response.dto';
import { LabTestRateListsService } from './lab-test-rate-lists.service';

@Controller('lab-test-rate-lists')
@UseGuards(AuthGuard)
export class LabTestRateListsController {
  constructor(
    private readonly labTestRateListsService: LabTestRateListsService,
  ) {}

  @Post()
  async create(
    @Body() body: LabTestRateListRequestDto,
    @Res() response: Response,
    @Headers('Authorization') authHeader: string,
  ): Promise<RateListCreateResponseDto> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const data = await this.labTestRateListsService.create(
        body,
        loggedInUser,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('error', err);
      throw new HttpException(
        { err: true, messages: 'Rate List not added' },
        422,
      );
    }
  }

  @Get('/make-copy')
  async makeCopy(
    @Res() response: Response,
    @Query() query,
    @Headers('Authorization') authHeader: string,
  ): Promise<RateListCreateResponseDto> {
    try {
      const id = query['_id'];
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const data = await this.labTestRateListsService.makeCopy(
        id,
        loggedInUser,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('error', err);
      throw new HttpException(
        { err: true, messages: 'Rate List not added' },
        422,
      );
    }
  }

  @Get('/get-all-tests')
  async getAllTests(
    @Res() response: Response,
    @Headers('Authorization') authHeader: string,
  ): Promise<GetAllTestsResponseDto[]> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const data = await this.labTestRateListsService.getAllTests(loggedInUser);
      console.log('data', data);
      response.status(200).send(data);
      return data;
    } catch (err) {
      throw new HttpException({ err: err, messages: 'Test not found' }, 422);
    }
  }

  @Get('/')
  async getAll(
    @Res() response: Response,
    @Query() query,
    @Headers('Authorization') authHeader: string,
  ): Promise<RateListResponseDto[]> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const sort = query['sort'];
      const filter = query['filter'];
      const skip = (page - 1) * perpage;
      const data = await this.labTestRateListsService.getAll(
        loggedInUser,
        skip,
        perpage,
        sort,
        filter,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err', err);
      throw new HttpException(
        { err: err, messages: 'Lab Test Rates not found' },
        422,
      );
    }
  }

  @Get('/print-rate-list')
  async printRateList(
    @Query() query,
    @Res() response: Response,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    try {
      const id = query['id'];
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const data = await this.labTestRateListsService.printRateList(
        id,
        loggedInUser,
      );
      if (data) {
        response.setHeader('Content-Type', 'application/pdf');
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Lab Test Rate not found' },
          422,
        );
      }
    } catch (err) {
      console.log(err);
      throw new HttpException(
        { err: err, messages: 'Lab Test Rate not found' },
        422,
      );
    }
  }

  @Get('/:id')
  async findOne(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const data = await this.labTestRateListsService.findOne(id);
      console.log('controller data', data);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Lab Test Rate not found' },
          422,
        );
      }
    } catch (err) {
      console.log(err);
      throw new HttpException(
        { err: err, messages: 'Lab Test Rate not found' },
        422,
      );
    }
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: LabTestRateListRequestDto,
    @Res() response: Response,
    @Headers('Authorization') authHeader: string,
  ): Promise<RateListCreateResponseDto> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const data = await this.labTestRateListsService.update(
        id,
        body,
        loggedInUser,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('error', err);
      throw new HttpException(
        { err: true, messages: 'Rate List not updated' },
        422,
      );
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const data = await this.labTestRateListsService.remove(id);
      response.status(204).send('Lab Rate List deleted');
    } catch (err) {
      console.log('error', err);
      throw new HttpException(
        { err: true, messages: 'Rate List not updated' },
        422,
      );
    }
  }
}
