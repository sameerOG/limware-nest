import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrintReportSettingDto } from './dto/request.dto';
import { InvoicePrintSettings } from '../invoice_print_settings.entity';
import { BaseService } from 'src/common/baseService';

@Injectable()
export class InvoicePrintSettingsSerive {
  private invoicePrintSettingRep: BaseService<InvoicePrintSettings>;
  constructor(
    @InjectRepository(InvoicePrintSettings)
    private invoicePrintSettingRepository: Repository<InvoicePrintSettings>,
  ) {
    this.invoicePrintSettingRep = new BaseService<InvoicePrintSettings>(
      this.invoicePrintSettingRepository,
    );
  }

  async getReportPrintSettings(
    laboratory_id,
  ): Promise<InvoicePrintSettings | any> {
    return await this.invoicePrintSettingRep.findOne({
      where: { laboratory_id: laboratory_id },
    });
  }

  async saveFooterText(
    laboratory_id,
    data: PrintReportSettingDto,
  ): Promise<InvoicePrintSettings | any> {
    const setting: InvoicePrintSettings =
      await this.invoicePrintSettingRep.findOne({
        where: { laboratory_id: laboratory_id },
      });
    if (setting) {
      setting.footer_text = data?.footer_text;
      return await this.invoicePrintSettingRep.save(setting);
    }
  }

  async saveLogoImage(
    laboratory_id,
    logo_image_name,
  ): Promise<InvoicePrintSettings | any> {
    const setting: InvoicePrintSettings =
      await this.invoicePrintSettingRep.findOne({
        where: { laboratory_id: laboratory_id },
      });
    if (setting) {
      setting.logo_image_name = logo_image_name;
      return await this.invoicePrintSettingRep.save(setting);
    }
  }
}
