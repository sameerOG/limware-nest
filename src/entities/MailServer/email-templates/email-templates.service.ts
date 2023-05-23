import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transformSortField } from 'src/common/utils/transform-sorting';
import { Repository, Like } from 'typeorm';
import { EmailTemplateRequestDto } from '../dto/email-templates/request.dto';
import { EmailTemplatesDto } from '../dto/email-templates/response.dto';
import { OutgoingMailServersDto } from '../dto/outgoing-mail-servers/response.dto';
import { EmailTemplate } from '../email_template.entity';
import { OutgoingMailServer } from '../outgoing_mail_server.entity';

@Injectable()
export class EmailTemplatesService {
  constructor(
    @InjectRepository(EmailTemplate)
    private emailTemplateRep: Repository<EmailTemplate>,
  ) {}

  async getAll(
    skip: number,
    take: number,
    text?: string,
    sort?: string,
  ): Promise<any[]> {
    let where: any = {};
    if (text) {
      where = [{ title: Like(`%${text}%`) }, { subject: Like(`%${text}%`) }];
    }
    const data = await this.emailTemplateRep.find({
      select: ['_id', 'title', 'action', 'subject', 'outgoing_mail_server_id'],
      relations: ['outgoing_mail_server_id'],
      where,
      skip,
      take,
      order: transformSortField(sort),
    });
    data.forEach((item) => {
      item['serverName'] = {
        _id: item.outgoing_mail_server_id._id,
        title: item.outgoing_mail_server_id.title,
      };
    });
    return data;
  }

  async getSingle(id: string): Promise<EmailTemplatesDto> {
    let where: any = {}; // Declare an empty where object

    if (id) {
      where._id = id;
    }
    const data = await this.emailTemplateRep.findOne({
      select: [
        '_id',
        'title',
        'action',
        'subject',
        'outgoing_mail_server_id',
        'body',
        'updated_at',
        'created_at',
      ],
      relations: ['outgoing_mail_server_id'],
      where,
    });
    const { ...rest } = data;
    return new EmailTemplatesDto({
      ...rest,
      outgoing_mail_server_id: data.outgoing_mail_server_id._id,
      created_at: data.created_at?.getTime(),
      updated_at: data.updated_at?.getTime(),
      updated_by: '',
    });
  }

  async add(body: any): Promise<EmailTemplatesDto> {
    const data = await this.emailTemplateRep.save(body);
    const { ...rest } = data;
    return new EmailTemplatesDto({
      ...rest,
      created_at: data.created_at.getTime(),
      updated_at: data.updated_at.getTime(),
      updated_by: '',
    });
  }

  async update(id: string, body: any): Promise<EmailTemplatesDto> {
    try {
      await this.emailTemplateRep.update(id, body);
      const data = await this.emailTemplateRep.findOne({
        select: [
          '_id',
          'title',
          'action',
          'subject',
          'outgoing_mail_server_id',
          'body',
          'updated_at',
          'created_at',
        ],
        relations: ['outgoing_mail_server_id'],
        where: { _id: id },
      });
      const { ...rest } = data;
      return new EmailTemplatesDto({
        ...rest,
        outgoing_mail_server_id: data.outgoing_mail_server_id._id,
        created_at: data.created_at?.getTime(),
        updated_at: data.updated_at?.getTime(),
        updated_by: '',
      });
    } catch (err) {
      return err;
    }
  }

  async delete(id: string): Promise<any> {
    try {
      return await this.emailTemplateRep.softDelete(id);
    } catch (err) {
      return err;
    }
  }
}
