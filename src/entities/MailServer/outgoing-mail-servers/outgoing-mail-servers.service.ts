import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { OutgoingMailServersRequestDto } from '../dto/outgoing-mail-servers/request.dto';
import { OutgoingMailServersDto } from '../dto/outgoing-mail-servers/response.dto';
import { OutgoingMailServer } from '../outgoing_mail_server.entity';

@Injectable()
export class OutgoingMailServersService {
  constructor(
    @InjectRepository(OutgoingMailServer)
    private osm: Repository<OutgoingMailServer>,
  ) {}

  async getAll(
    skip: number,
    take: number,
    text?: string,
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
    const data = await this.osm.find({
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
    const data = await this.osm.find({
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
      return err;
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
