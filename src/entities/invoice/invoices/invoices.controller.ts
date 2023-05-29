import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  Headers,
  HttpException,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { Response } from 'express';
import jwtDecode from 'jwt-decode';
import { InvoiceLineItemsResponseDto } from './dto/response.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('/get-with-line-items')
  async getWithLineItems(
    @Res() response: Response,
    @Query() query,
    @Headers('Authorization') authHeader: string,
  ): Promise<InvoiceLineItemsResponseDto> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const invoice_id = query['invoice_id'];
      const data = await this.invoicesService.getWithLineItems(
        invoice_id,
        loggedInUser,
      );
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Patient not found' },
          422,
        );
      }
    } catch (err) {
      console.log('err ', err);
      throw new HttpException(
        { err: true, messages: 'Patient not found' },
        422,
      );
    }
  }
}
