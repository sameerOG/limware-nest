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
  UseGuards,
  Headers,
  HttpException,
} from '@nestjs/common';
import {
  ReportTemplate,
  SingleTestCategory,
  TestCategoryDto,
} from '../dto/test-category/response.dto';
import { TestCategoriesService } from './test-categories.service';
import { query, Response } from 'express';
import { TestCategoryRequestDto } from '../dto/test-category/request.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import jwtDecode from 'jwt-decode';
@Controller('')
@UseGuards(AuthGuard)
export class TestCategoriesController {
  constructor(private testCategoryService: TestCategoriesService) {}

  @Get('/test-categories')
  async getAll(
    @Res() response: Response,
    @Query() query,
    @Headers('Authorization') authHeader: string,
  ): Promise<TestCategoryDto[]> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const sort = query['sort'];
      const text = query.filter?.name;
      const skip = (page - 1) * perpage;

      let data = await this.testCategoryService.getAll(
        loggedInUser,
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
        .send({ error: err, message: 'Test Categories not found' });
    }
  }

  @Get('/test-categories/get-all')
  async getAllComplete(
    @Res() response: Response,
    @Query() query,
  ): Promise<TestCategoryDto[]> {
    try {
      let data = await this.testCategoryService.getAllComplete();
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Test Categories not found' });
    }
  }

  @Get('/test-categories/:id')
  async getSingle(
    @Res() response: Response,
    @Param('id') id,
    @Query() query,
  ): Promise<TestCategoryDto> {
    try {
      const expand = query['expand'];
      let data = await this.testCategoryService.getSingle(id, expand);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Test Category not found' });
    }
  }

  @Post('/test-categories')
  async add(
    @Res() response: Response,
    @Headers('Authorization') authHeader: string,
    @Body() body: TestCategoryRequestDto,
  ): Promise<SingleTestCategory> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.testCategoryService.add(body, loggedInUser);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Test Category not added' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Test Category not added' });
    }
  }

  @Put('/test-categories/:id')
  async update(
    @Res() response: Response,
    @Body() body: TestCategoryRequestDto,
    @Param('id') id: string,
  ): Promise<SingleTestCategory> {
    try {
      let data = await this.testCategoryService.update(id, body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Test Category not updated' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Test Category not updated' });
    }
  }

  @Delete('/test-categories/:id')
  async delete(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<any> {
    try {
      let data = await this.testCategoryService.delete(id);
      if (data.affected > 0) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Test Category not deleted' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Test Category not deleted' });
    }
  }

  @Get('/report-templates')
  async getReportTemplates(
    @Res() response: Response,
  ): Promise<ReportTemplate[]> {
    try {
      const data = [
        {
          code: 1,
          description:
            '2 Column layout with test name, result, normal range and uom',
          name: 'Template 1',
        },
        {
          code: 2,
          description:
            '3 Column layout with test name, result and normal range',
          name: 'Template 2',
        },
        {
          code: 3,
          description: '2 Column layout with test name and result',
          name: 'Template 3',
        },
        {
          code: 4,
          description:
            'Auto left aligned test parameters which contain test name, result and uom',
          name: 'Template 4',
        },
        {
          code: 5,
          description:
            'Cross match report template to show donor information as well.',
          name: 'Cross Match',
        },
        {
          code: 5,
          description: 'Widal report template.',
          name: 'Widal',
        },
      ];
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Report Templates not found' });
    }
  }
}
