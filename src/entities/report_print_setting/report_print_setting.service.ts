import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/baseService';
import { Repository } from 'typeorm';
import { PrintReportSettingDto } from '../invoice/invoice_print_setting/dto/request.dto';
import { ReportPrintSetting } from './report_print_setting.entity';

@Injectable()
export class ReportPrintSettingService {
  private repPrintSetRep: BaseService<ReportPrintSetting>;

  constructor(
    @InjectRepository(ReportPrintSetting)
    private repPrintSetRepository: Repository<ReportPrintSetting>,
  ) {
    this.repPrintSetRep = new BaseService<ReportPrintSetting>(
      this.repPrintSetRepository,
    );
  }

  async getReportPrintSettings(
    laboratory_id,
  ): Promise<ReportPrintSetting | any> {
    return await this.repPrintSetRep.findOne({
      where: { laboratory_id: laboratory_id },
    });
  }
  async updateHeaderType(
    laboratory_id,
    data: PrintReportSettingDto,
  ): Promise<ReportPrintSetting | any> {
    const setting: ReportPrintSetting = await this.repPrintSetRep.findOne({
      where: { laboratory_id: laboratory_id },
    });
    if (setting) {
      if (data?.default_header_type) {
        setting.default_header_type = data?.default_header_type;
        return await this.repPrintSetRep.save(setting);
      }
      if (data?.default_download_header_type) {
        setting.default_download_header_type =
          data?.default_download_header_type;
        return await this.repPrintSetRep.save(setting);
      }
    }
  }
  async updateFooterType(
    laboratory_id,
    data: PrintReportSettingDto,
  ): Promise<ReportPrintSetting | any> {
    const setting: ReportPrintSetting = await this.repPrintSetRep.findOne({
      where: { laboratory_id: laboratory_id },
    });
    if (setting) {
      if (data?.default_footer_type) {
        setting.default_footer_type = data?.default_footer_type;
        return await this.repPrintSetRep.save(setting);
      }
      if (data?.default_download_footer_type) {
        setting.default_download_footer_type =
          data?.default_download_footer_type;
        return await this.repPrintSetRep.save(setting);
      }
    }
  }
  async saveReportSettings(
    laboratory_id,
    data: PrintReportSettingDto,
  ): Promise<ReportPrintSetting | any> {
    const setting: ReportPrintSetting = await this.repPrintSetRep.findOne({
      where: { laboratory_id: laboratory_id },
    });
    if (setting) {
      setting.margin_bottom = data?.margin_bottom;
      setting.margin_left = data?.margin_left;
      setting.margin_top = data?.margin_top;
      setting.margin_right = data?.margin_right;
      return await this.repPrintSetRep.save(setting);
    }
  }
  async saveHeaderText(
    laboratory_id,
    data: PrintReportSettingDto,
  ): Promise<ReportPrintSetting | any> {
    const setting: ReportPrintSetting = await this.repPrintSetRep.findOne({
      where: { laboratory_id: laboratory_id },
    });
    if (setting) {
      setting.header_text = data?.header_text;
      return await this.repPrintSetRep.save(setting);
    }
  }

  async saveFooterText(
    laboratory_id,
    data: PrintReportSettingDto,
  ): Promise<ReportPrintSetting | any> {
    const setting: ReportPrintSetting = await this.repPrintSetRep.findOne({
      where: { laboratory_id: laboratory_id },
    });
    if (setting) {
      setting.footer_text = data?.footer_text;
      return await this.repPrintSetRep.save(setting);
    }
  }

  async saveHeaderImage(
    laboratory_id,
    header_image_name,
  ): Promise<ReportPrintSetting | any> {
    const setting: ReportPrintSetting = await this.repPrintSetRep.findOne({
      where: { laboratory_id: laboratory_id },
    });
    if (setting) {
      setting.header_image_name = header_image_name;
      return await this.repPrintSetRep.save(setting);
    }
  }
  async saveFooterImage(
    laboratory_id,
    footer_image_name,
  ): Promise<ReportPrintSetting | any> {
    const setting: ReportPrintSetting = await this.repPrintSetRep.findOne({
      where: { laboratory_id: laboratory_id },
    });
    if (setting) {
      setting.footer_image_name = footer_image_name;
      return await this.repPrintSetRep.save(setting);
    }
  }
}
