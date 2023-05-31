import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { Patient } from 'src/entities/patient/patient.entity';
import { Repository } from 'typeorm';
import { Invoice } from '../invoice.entity';
import { InvoiceLineItem } from '../invoice_line_item.entity';
import { InvoicePrintSettings } from '../invoice_print_settings.entity';
import { InvoiceLineItemsResponseDto } from './dto/response.dto';
import * as path from 'path';
import * as fs from 'fs';
import { FileHandling } from 'src/common/file-handling';

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
    private fileHandling: FileHandling,
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

  async printPdfInvoice() {}

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
}
