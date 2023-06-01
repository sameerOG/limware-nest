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
import {
  AddPaymentResponseDto,
  Invoice,
  InvoiceLineItemsResponseDto,
} from './dto/response.dto';
import { AddDiscountRequestDto, AddPaymentRequestDto } from './dto/request.dto';
import { PaymentTRansaction } from 'src/entities/pricing/payment_transaction.entity';

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
          { err: true, messages: 'Invoice not found' },
          422,
        );
      }
    } catch (err) {
      console.log('err ', err);
      throw new HttpException(
        { err: true, messages: 'Invoice not found' },
        422,
      );
    }
  }

  @Get('/print-invoice')
  async printInvoice(
    @Res() response: Response,
    @Query() query,
    @Headers('Authorization') authHeader: string,
  ): Promise<InvoiceLineItemsResponseDto> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const invoice_id = query['invoice_id'];
      const data = await this.invoicesService.printInvoice(
        invoice_id,
        loggedInUser,
      );
      if (data) {
        const pdf = await this.invoicesService.__print(data);
        response.setHeader('Content-Type', 'application/pdf');
        response.status(200).send(pdf);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Invoice not found' },
          422,
        );
      }
    } catch (err) {
      console.log('err ', err);
      throw new HttpException(
        { err: true, messages: 'Invoice not found' },
        422,
      );
    }
  }

  @Post('/add-payment')
  async addPayment(
    @Res() response: Response,
    @Body() body: AddPaymentRequestDto,
    @Headers('Authorization') authHeader: string,
  ): Promise<AddPaymentRequestDto> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const data: any = await this.invoicesService.addPayment(
        body,
        loggedInUser,
      );
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Payment not added' },
          422,
        );
      }
    } catch (err) {
      console.log('err ', err);
      throw new HttpException(
        { err: true, messages: 'Payment not added' },
        422,
      );
    }
  }

  @Post('/update-discount')
  async updateDiscount(
    @Res() response: Response,
    @Body() body: AddDiscountRequestDto,
    @Headers('Authorization') authHeader: string,
  ): Promise<AddPaymentRequestDto> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const data: any = await this.invoicesService.updateDiscount(
        body,
        loggedInUser,
      );
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Discount not updated' },
          422,
        );
      }
    } catch (err) {
      console.log('err ', err);
      throw new HttpException(
        { err: true, messages: 'Discount not updated' },
        422,
      );
    }
  }
}
