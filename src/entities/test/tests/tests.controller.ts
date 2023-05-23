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
  Headers,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import jwtDecode from 'jwt-decode';
import { AuthGuard } from 'src/guard/auth.guard';
import {
  TestNormalRangeRequest,
  TestRequestDto,
} from '../dto/test-category/request.dto';
import {
  SingleTestResponseDto,
  TestNormalRangeResponse,
  TestResponseDto,
} from '../dto/test-category/response.dto';
import { TestsService } from './tests.service';

@Controller('')
@UseGuards(AuthGuard)
export class TestsController {
  constructor(private testService: TestsService) {}

  @Get('/tests')
  async getAll(
    @Res() response: Response,
    @Query() query,
  ): Promise<TestResponseDto[]> {
    try {
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const sort = query['sort'];
      const text = query.filter?.username?.like;
      const skip = (page - 1) * perpage;

      let data = await this.testService.getAll(skip, perpage, text, sort);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send([]);
    }
  }

  @Get('/tests/:id')
  async getSingle(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<SingleTestResponseDto> {
    try {
      let data = await this.testService.getSingle(id);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
    }
  }

  @Put('/tests/:id')
  async update(
    @Res() response: Response,
    @Body() body: TestRequestDto,
    @Param('id') id,
  ): Promise<SingleTestResponseDto> {
    try {
      let data = await this.testService.update(id, body);
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

  @Post('/tests')
  async add(
    @Res() response: Response,
    @Body() body: TestRequestDto,
    @Headers('Authorization') authHeader: string,
  ): Promise<SingleTestResponseDto> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.testService.add(body, loggedInUser);
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

  @Delete('/tests/:id')
  async delete(
    @Res() response: Response,
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      await this.testService.delete(id, loggedInUser);
      response.status(204).send('Test deleted successfully');
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
    }
  }

  @Get('/test-normal-ranges/:id')
  async getSingleTestNormalRange(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<TestNormalRangeResponse> {
    try {
      let data = await this.testService.getSingleTestNormalRange(id);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
    }
  }

  @Put('/test-normal-ranges/:id')
  async updateTestNormalRange(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() body: TestNormalRangeRequest,
  ): Promise<TestNormalRangeResponse> {
    try {
      let data = await this.testService.updateTestNormalRange(id, body);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
    }
  }

  @Post('/test-normal-ranges/')
  async addTestNormalRange(
    @Res() response: Response,
    @Body() body: TestNormalRangeRequest,
  ): Promise<TestNormalRangeResponse> {
    try {
      let data = await this.testService.addTestNormalRange(body);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
    }
  }

  @Delete('/test-normal-ranges/:id')
  async deleteTestNormalRange(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<void> {
    try {
      await this.testService.deleteNormalRange(id);
      response.status(204).send();
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
    }
  }
}
