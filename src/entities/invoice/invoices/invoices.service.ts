import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../invoice.entity';
import { InvoiceLineItem } from '../invoice_line_item.entity';
import { InvoiceLineItemsResponseDto } from './dto/response.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRep: Repository<Invoice>,
    @InjectRepository(InvoiceLineItem)
    private invoiceLineItemRep: Repository<InvoiceLineItem>,
  ) {}

  async getWithLineItems(
    invoice_id: string,
    user,
  ): Promise<InvoiceLineItemsResponseDto> {
    const invoice = await this.invoiceRep
      .createQueryBuilder('invoice')
      .select('invoice.*')
      .where('invoice._id = :_id', { _id: invoice_id })
      .getRawOne();

    const invoiceLineItems = await this.invoiceLineItemRep
      .createQueryBuilder('invoice_line_item')
      .select('invoice_line_item.*')
      .where('invoice_line_item.invoice_id = :invoice_id', { invoice_id })
      .getRawMany();

    return {
      invoice,
      invoiceLineItems,
    };
  }
}
