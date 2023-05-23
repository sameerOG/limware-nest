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
      const sort = query['sort'];
      const text = query.filter?.name;
      const skip = (page - 1) * perpage;
      let data = await this.customerService.getCustomers(
        skip,
        perpage,
        text,
        sort,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Customers not found' });
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
      response.status(422).send({ error: err, message: 'Customer not found' });
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
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Customer not updated' });
    }
  }

  @Post('/')
  async addCustomer(
    @Res() response: Response,
    @Body() body: CustomerRequestDto,
  ): Promise<SingleCustomerDto> {
    try {
      let data = await this.customerService.addCustomer(body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Customer not added' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Customer not added' });
    }
  }

  @Delete('/:id')
  async deleteCustomer(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<void> {
    try {
      await this.customerService.deleteCustomer(id);
      response.status(204).send('Customer deleted successfully');
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Customer not deleted' });
    }
  }
}
