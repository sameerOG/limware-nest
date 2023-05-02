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
} from '@nestjs/common';
import { CustomerRequestDto } from '../dto/request.dto';
import { CustomerDto, SingleCustomerDto } from '../dto/response.dto';
import { CustomersService } from './customers.service';
import { Response } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
@Controller('customers')
@UseGuards(AuthGuard)
export class CustomersController {
  constructor(private customerService: CustomersService) {}

  @Get('/')
  async getCustomers(
    @Res() response: Response,
    @Query() query,
  ): Promise<CustomerDto[]> {
    try {
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const text = query.filter?.username?.like;
      const skip = (page - 1) * perpage;

      let data = await this.customerService.getCustomers(skip, perpage, text);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send([]);
    }
  }

  @Get('/:id')
  async getCustomer(
    @Res() response: Response,
    @Param('id') id,
  ): Promise<CustomerDto> {
    try {
      let data = await this.customerService.getCustomer(id);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
    }
  }

  @Put('/:id')
  async updateCustomer(
    @Res() response: Response,
    @Body() body: CustomerRequestDto,
    @Param('id') id,
  ): Promise<SingleCustomerDto> {
    try {
      let data = await this.customerService.updateCustomer(id, body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        response.status(400).send([]);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
    }
  }

  @Post('/')
  async addCustomer(
    @Res() response: Response,
    @Body() body: CustomerRequestDto,
  ): Promise<SingleCustomerDto> {
    try {
      let data = await this.customerService.addCustomer(body);
      console.log('data', data);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        response.status(400).send([]);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
    }
  }

  @Delete('/:id')
  async deleteCustomer(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<void> {
    try {
      let data = await this.customerService.deleteCustomer(id);
      if (data.affected > 0) {
        response.status(204).send('Customer deleted successfully');
      } else {
        response.status(400).send([]);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
    }
  }
}
