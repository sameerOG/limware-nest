import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/baseService';
import { emailRegex } from 'src/common/helper/enums';
import { transformSortField } from 'src/common/utils/transform-sorting';
import { Repository, Like } from 'typeorm';
import { OutgoingMailServersRequestDto } from '../dto/outgoing-mail-servers/request.dto';
import { OutgoingMailServersDto } from '../dto/outgoing-mail-servers/response.dto';
import { OutgoingMailServer } from '../outgoing_mail_server.entity';

@Injectable()
export class OutgoingMailServersService {
  private osm: BaseService<OutgoingMailServer>;
  constructor(
    @InjectRepository(OutgoingMailServer)
    private osmRep: Repository<OutgoingMailServer>,
  ) {
    this.osm = new BaseService<OutgoingMailServer>(this.osmRep);
  }

  async getAll(
    skip: number,
    take: number,
    text?: string,
    sort?: string,
  ): Promise<OutgoingMailServersDto[]> {
    let where: any = {}; // Declare an empty where object

    if (text) {
      where = [
        { title: Like(`%${text}%`) },
        { username: Like(`%${text}%`) },
        { host: Like(`%${text}%`) },
        { port: Like(`%${text}%`) },
        { encryption: Like(`%${text}%`) },
      ];
    }
    const data = await this.osm.findAll({
      select: [
        '_id',
        'title',
        'is_default',
        'host',
        'port',
        'encryption',
        'username',
      ],
      where,
      skip,
      take,
      order: transformSortField(sort),
    });
    return data;
  }

  async getSingle(id: string): Promise<OutgoingMailServersDto> {
    let where: any = {}; // Declare an empty where object

    if (id) {
      where._id = id;
    }
    const data = await this.osm.findOne({
      select: [
        '_id',
        'title',
        'is_default',
        'host',
        'port',
        'encryption',
        'username',
        'password',
        'created_at',
        'updated_at',
      ],
      where,
    });
    const { ...rest } = data;
    return new OutgoingMailServersDto({
      ...rest,
      created_at: data.created_at.getTime(),
      updated_at: data.updated_at.getTime(),
      updated_by: '',
    });
  }

  async getOutgoingMailServers(): Promise<OutgoingMailServersDto[]> {
    const data = await this.osm.findAll({
      select: [
        '_id',
        'title',
        'is_default',
        'host',
        'port',
        'encryption',
        'username',
      ],
    });
    return data;
  }

  async add(
    body: OutgoingMailServersRequestDto,
  ): Promise<OutgoingMailServersDto> {
    if (body.username && body.username !== '') {
      if (!emailRegex.test(body.username)) {
        throw [
          {
            field: 'username',
            message: 'Username is not a valid email address.',
          },
        ];
      }
    }
    const data = await this.osm.save(body);
    const { ...rest } = data;
    return new OutgoingMailServersDto({
      ...rest,
      created_at: data.created_at.getTime(),
      updated_at: data.updated_at.getTime(),
      updated_by: '',
    });
  }

  async update(
    id: string,
    body: OutgoingMailServersRequestDto,
  ): Promise<OutgoingMailServersDto> {
    try {
      if (body.username && body.username !== '') {
        if (!emailRegex.test(body.username)) {
          throw [
            {
              field: 'username',
              message: 'Username is not a valid email address.',
            },
          ];
        }
      }
      await this.osm.update(id, body);
      const data = await this.osm.findOne({
        select: [
          '_id',
          'title',
          'is_default',
          'host',
          'port',
          'encryption',
          'username',
          'password',
          'created_at',
          'updated_at',
        ],
        where: { _id: id },
      });
      const { ...rest } = data;
      return new OutgoingMailServersDto({
        ...rest,
        created_at: data.created_at.getTime(),
        updated_at: data.updated_at.getTime(),
        updated_by: '',
      });
    } catch (err) {
      throw err;
    }
  }

  async delete(id: string): Promise<any> {
    try {
      return await this.osm.softDelete(id);
    } catch (err) {
      return err;
    }
  }
}
