import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { Patient } from 'src/entities/patient/patient.entity';
import { Repository } from 'typeorm';
import { Invoice } from '../invoice.entity';
import { InvoiceLineItem } from '../invoice_line_item.entity';
import { InvoicePrintSettings } from '../invoice_print_settings.entity';
import {
  AddPaymentResponseDto,
  InvoiceLineItemsResponseDto,
} from './dto/response.dto';
import * as path from 'path';
import * as fs from 'fs';
import { FileHandling } from 'src/common/file-handling';
import { AddDiscountRequestDto, AddPaymentRequestDto } from './dto/request.dto';
import { PaymentTRansaction } from 'src/entities/pricing/payment_transaction.entity';
import { PatientsService } from 'src/entities/patient/patients/patients.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRep: Repository<Invoice>,
    @InjectRepository(Patient)
    private patientRep: Repository<Patient>,
    @InjectRepository(Laboratory)
    private labRep: Repository<Laboratory>,
    @InjectRepository(InvoicePrintSettings)
    private invoicePrintSettingRep: Repository<InvoicePrintSettings>,
    @InjectRepository(InvoiceLineItem)
    private invoiceLineItemRep: Repository<InvoiceLineItem>,
    @InjectRepository(PaymentTRansaction)
    private paymentTransactionRep: Repository<PaymentTRansaction>,
    private fileHandling: FileHandling,
    private patientService: PatientsService,
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

  async printInvoice(invoice_id: string, user): Promise<any> {
    const invoice = await this.invoiceRep
      .createQueryBuilder('invoice')
      .select('invoice.*')
      .where('invoice._id = :_id', { _id: invoice_id })
      .andWhere('invoice.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    const invoiceLineItems = await this.invoiceLineItemRep
      .createQueryBuilder('invoice_line_item')
      .select('invoice_line_item.*')
      .where('invoice_line_item.invoice_id = :invoice_id', {
        invoice_id: invoice_id,
      })
      .getRawMany();

    invoiceLineItems.forEach(async (ili) => {
      const testPriceAmountAry = await this.fileHandling.separateDecimalValue(
        ili.amount,
      );
      Object.assign(ili, { testPriceAmountAry });
    });

    const patient = await this.patientRep
      .createQueryBuilder('patient')
      .select('patient.*')
      .where('patient._id = :_id', { _id: invoice.patient_id })
      .andWhere('patient.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    const labModel = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    const ipsModel = await this.invoicePrintSettingRep
      .createQueryBuilder('invoice_print_setting')
      .select('invoice_print_setting.*')
      .where('invoice_print_setting.laboratory_id = :laboratory_id', {
        laboratory_id: labModel?._id,
      })
      .getRawOne();

    let invoicePrintSettings = { logo: null, footer_text: null };
    if (ipsModel) {
      invoicePrintSettings.footer_text = ipsModel.footer_text;
      let pathAry = ['uploads', 'labs', labModel?._id, 'print_settings'];
      const path = await this.getPath(pathAry, true);

      if (ipsModel.logo_image_name) {
        const filePath = `${path}/${ipsModel.logo_image_name}`;
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const invoiceLogo = filePath;
          invoicePrintSettings.logo = invoiceLogo;
        }
      }
    }

    return {
      patient,
      invoice,
      invoice_line_items: invoiceLineItems,
      invoice_print_settings: invoicePrintSettings,
      labModel,
      invoice_id,
      user,
    };
  }

  async __print(data): Promise<any> {
    const {
      total_amount,
      discount_amount,
      due_amount,
      paid_amount,
      total_payable_amount,
    } = data.invoice;
    const totalAmountAry = await this.fileHandling.separateDecimalValue(
      total_amount,
    );
    const discountAmountAry = await this.fileHandling.separateDecimalValue(
      discount_amount,
    );
    const dueAmountAry = await this.fileHandling.separateDecimalValue(
      due_amount,
    );
    const paidAmountAry = await this.fileHandling.separateDecimalValue(
      paid_amount,
    );
    const totalPayableAmountAry = await this.fileHandling.separateDecimalValue(
      total_payable_amount,
    );

    Object.assign(data, {
      totalAmountAry,
      discountAmountAry,
      dueAmountAry,
      paidAmountAry,
      totalPayableAmountAry,
    });
    const reportTemplate = '_invoice_template_1';
    const content = await this.fileHandling.renderTemplate(reportTemplate, {
      data,
    });
    const options = {
      format: 'A4',
      border: {
        left: '7px',
        right: '0px',
        top: '16px',
        bottom: '16px',
      },
      header: {
        height: '9px',
      },
      footer: {
        height: '10px',
      },
    };
    const folderPath = process.cwd() + '/src/common/uploads/invoices';
    const fileName = `${data.invoice_id}-${new Date().getTime()}.pdf`;
    const filePath = path.join(folderPath, fileName);
    return await this.fileHandling.generatePdf(options, content, filePath);
  }

  async getPath(pathArray, createDirectory = false) {
    let pathString = __dirname + '/../';

    pathArray.forEach((dirName) => {
      pathString += dirName + '/';

      if (createDirectory) {
        if (!fs.existsSync(pathString)) {
          fs.mkdirSync(pathString);
        }
      }
    });

    return pathString;
  }

  async addPayment(
    body: AddPaymentRequestDto,
    user,
    return_invoice?: boolean,
  ): Promise<AddPaymentResponseDto> {
    const { invoice_id, amount, type, user_comment } = body;
    let attributes = {
      facility_id: user.facility_id,
      invoice_id,
      amount: type === 1 ? amount : amount * -1,
      payment_method: 1, // 1 for cash
      user_comment,
      type,
    };
    const invoice = await this.invoiceRep
      .createQueryBuilder('invoice')
      .select('invoice.*')
      .where('invoice._id = :_id', { _id: invoice_id })
      .getRawOne();
    const data = await this.paymentTransactionRep.save(attributes);
    if (data) {
      let paidStatus: number;
      if (
        invoice.due_amount - amount != 0 &&
        invoice.due_amount - amount != invoice.total_amount
      ) {
        paidStatus = 2;
      } else if (invoice.due_amount - amount === 0) {
        paidStatus = 3;
      } else {
        paidStatus = 1;
      }
      await this.invoiceRep
        .createQueryBuilder('invoice')
        .update(Invoice)
        .set({
          paid_amount: invoice.paid_amount + amount,
          due_amount: invoice.due_amount - amount,
          status: paidStatus,
        })
        .where('invoice._id = :_id', { _id: invoice_id })
        .execute();
      if (return_invoice) {
        return invoice;
      } else {
        const payload = {
          appointment_id: invoice.appointment_id,
          created_at: data.date_created.getTime(),
          description: '',
          discount_amount: invoice.discount_amount,
          due_amount: invoice.due_amount - amount,
          facility_id: user.facility_id,
          invoice_date: invoice.created_at.getTime(),
          invoice_number: invoice.invoice_number,
          paid_amount: invoice.paid_amount + amount,
          patient_account_id: invoice.patient_account_id,
          patient_id: invoice.patient_id,
          status: paidStatus,
          title: invoice.title,
          total_amount: invoice.total_amount,
          total_payable_amount: invoice.total_payable_amount,
          updated_at: data.date_modified.getTime(),
          updated_by: user._id,
          _id: invoice.patient_id,
        };
        return payload;
      }
    }
  }

  async updateDiscount(
    body: AddDiscountRequestDto,
    user,
    return_invoice?: boolean,
  ): Promise<AddPaymentResponseDto> {
    const { invoice_id, discount_amount, user_comment } = body;
    const invoice = await this.invoiceRep
      .createQueryBuilder('invoice')
      .select('invoice.*')
      .where('invoice._id = :_id', { _id: invoice_id })
      .getRawOne();

    if (invoice) {
      let attributes = {
        discount_amount,
      };
      await this.invoiceRep.update(invoice_id, attributes);
      await this.updateInvoiceAmountsAfterSave(invoice_id);
      const savedInvoice = await this.invoiceRep
        .createQueryBuilder('invoice')
        .select('invoice.*')
        .where('invoice._id = :_id', { _id: invoice_id })
        .getRawOne();

      if (savedInvoice) {
        const payload = {
          appointment_id: savedInvoice.appointment_id,
          created_at: savedInvoice.created_at.getTime(),
          description: '',
          discount_amount: savedInvoice.discount_amount,
          due_amount: savedInvoice.due_amount,
          facility_id: user.facility_id,
          invoice_date: savedInvoice.created_at.getTime(),
          invoice_number: savedInvoice.invoice_number,
          paid_amount: savedInvoice.paid_amount,
          patient_account_id: savedInvoice.patient_account_id,
          patient_id: savedInvoice.patient_id,
          status: savedInvoice.status,
          title: savedInvoice.title,
          total_amount: savedInvoice.total_amount,
          total_payable_amount: savedInvoice.total_payable_amount,
          updated_at: savedInvoice.updated_at.getTime(),
          updated_by: user._id,
          _id: savedInvoice.patient_id,
        };
        return payload;
      }
    }
  }

  async updateInvoiceAmountsAfterSave(invoice_id: string) {
    const invoice = await this.invoiceRep
      .createQueryBuilder('invoice')
      .select('invoice.*')
      .where('invoice._id = :_id', { _id: invoice_id })
      .getRawOne();
    const allPayments = await this.paymentTransactionRep
      .createQueryBuilder('payment_transaction')
      .select('payment_transaction.*')
      .where('payment_transaction.invoice_id = :invoice_id', {
        invoice_id: invoice._id,
      })
      .getRawMany();

    let paid_amount = 0;
    let due_amount = 0;

    allPayments.forEach((payment) => {
      paid_amount = paid_amount + payment.amount;
    });
    due_amount = invoice.total_amount - (paid_amount + invoice.discount_amount);
    invoice.paid_amount = paid_amount;
    invoice.due_amount = due_amount;
    invoice.total_payable_amount =
      invoice.total_amount - invoice.discount_amount;
    if (invoice.due_amount === 0) {
      invoice.status = 3; // status paid
    } else if (invoice.paid_amount === 0) {
      invoice.status = 1; // status unpaid
    } else {
      invoice.status = 2; // status partially paid
    }

    await this.invoiceRep.update(invoice._id, invoice);
    this.patientService.updateAppointmentInfo(invoice.patient_id, {
      invoice_status: invoice.status,
    });
  }
}
