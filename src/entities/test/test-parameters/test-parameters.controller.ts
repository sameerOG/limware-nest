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
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import jwtDecode from 'jwt-decode';
import { AuthGuard } from 'src/guard/auth.guard';
import {
  MultiplePayload,
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
@UseGuards(AuthGuard)
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
      response
        .status(422)
        .send({ error: err, message: 'Test Parameters not found' });
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
      response
        .status(422)
        .send({ error: err, message: 'Test Groups not found' });
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
      response
        .status(422)
        .send({ error: err, message: 'Test Parameters not found' });
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
      response
        .status(422)
        .send({ error: err, message: 'Test Parameter not found' });
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
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Test Parameter not added' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Test Parameter not added' });
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
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Test Parameter not updated' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Test Parameter not updated' });
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
      response
        .status(422)
        .send({ error: err, message: 'Test Parameter not deleted' });
    }
  }

  @Post('/test-parameters/create-multiple')
  async createMultiple(
    @Body() body: MultiplePayload,
    @Headers('Authorization') authHeader: string,
    @Res() response: Response,
  ): Promise<boolean> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const data = await this.testParameterService.createMultiple(
        body,
        loggedInUser,
      );
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        response
          .status(422)
          .send({ error: true, message: 'Test Parameter not created' });
      }
    } catch (err) {
      console.log('err', err);
      response
        .status(422)
        .send({ error: err, message: 'Test Parameter not created' });
    }
  }
}
