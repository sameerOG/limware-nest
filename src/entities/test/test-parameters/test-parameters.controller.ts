import {
  Controller,
  Get,
  Query,
  Res,
  Headers,
  Body,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import jwtDecode from 'jwt-decode';
import {
  TestParameterRequest,
  UpdateTestParameterRequestDto,
} from '../dto/test-category/request.dto';
import {
  AllGroups,
  CreateParameterTestResponse,
  SingleParameterTestResponse,
  TestParameterResponse,
  UnassignedParameters,
} from '../dto/test-category/response.dto';
import { TestParameter } from '../test_parameter.entity';
import { TestParametersService } from './test-parameters.service';

@Controller('')
export class TestParametersController {
  constructor(private testParameterService: TestParametersService) {}

  @Get('/test-parameters/get-all-parameters')
  async getAllParameters(
    @Res() response: Response,
    @Query() query,
    @Headers('Authorization') authHeader: string,
  ): Promise<TestParameterResponse> {
    try {
      const parent_test_id = query['parent_test_id'];
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.testParameterService.getAllParameters(
        parent_test_id,
        loggedInUser,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send([]);
    }
  }

  @Get('/test-groups/get-all-groups')
  async getAllGroups(
    @Res() response: Response,
    @Query() query,
    @Headers('Authorization') authHeader: string,
  ): Promise<AllGroups[]> {
    try {
      const parent_id = query['parent_id'];
      const parent = query['parent'];
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.testParameterService.getAllGroups(
        parent_id,
        parent,
        loggedInUser,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send([]);
    }
  }

  @Get('/test-parameters/get-unassigned-parameters')
  async getUnassignedParameters(
    @Res() response: Response,
    @Query() query,
    @Headers('Authorization') authHeader: string,
  ): Promise<UnassignedParameters[]> {
    try {
      const parent_test_id = query['parent_test_id'];
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.testParameterService.getUnassignedParameters(
        parent_test_id,
        loggedInUser,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send([]);
    }
  }

  @Get('/test-parameters/:id')
  async getTestParameter(
    @Res() response: Response,
    @Param('id') id,
    @Headers('Authorization') authHeader: string,
  ): Promise<SingleParameterTestResponse> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.testParameterService.getTestParameter(
        id,
        loggedInUser,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send([]);
    }
  }

  @Post('/tests/create-parametric-test')
  async createParameterTest(
    @Res() response: Response,
    @Headers('Authorization') authHeader: string,
    @Body() body: TestParameterRequest,
  ): Promise<CreateParameterTestResponse> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.testParameterService.createParameterTest(
        body,
        loggedInUser,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send([]);
    }
  }

  @Put('/test-parameters/:id')
  async updateTestParameter(
    @Res() response: Response,
    @Param('id') id,
    @Body() body: UpdateTestParameterRequestDto,
    @Headers('Authorization') authHeader: string,
  ): Promise<TestParameter> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.testParameterService.updateTestParameter(
        id,
        body,
        loggedInUser,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send([]);
    }
  }

  @Delete('/test-parameters/:id')
  async deleteTestParameter(
    @Res() response: Response,
    @Param('id') id,
    @Headers('Authorization') authHeader: string,
  ): Promise<TestParameter> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.testParameterService.deleteTestParameter(
        id,
        loggedInUser,
      );
      response.status(204).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send([]);
    }
  }
}
