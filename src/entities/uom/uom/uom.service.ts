import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UomRequestDto } from '../dto/request.dto';
import { SingleUomDto, UomDto } from '../dto/response.dto';
import { UOM } from '../uom.entity';

@Injectable()
export class UomService {
  constructor(
    @InjectRepository(UOM)
    private uomRep: Repository<UOM>,
  ) {}

  async getAll(skip: number, take: number, text?: string): Promise<UomDto[]> {
    let where: any = {}; // Declare an empty where object

    if (text) {
      where = [{ name: Like(`%${text}%`) }, { description: Like(`%${text}%`) }];
    }
    const data = await this.uomRep.find({
      select: ['_id', 'name', 'description'],
      where,
      skip,
      take,
    });
    return data;
  }

  async getAllComplete(): Promise<UomDto[]> {
    const data = await this.uomRep.find({
      select: ['_id', 'name', 'description'],
    });
    return data;
  }

  async add(body: any): Promise<SingleUomDto> {
    const data = await this.uomRep.save(body);
    const { ...rest } = data;
    return new SingleUomDto({
      ...rest,
      created_at: data.created_at.getTime(),
      updated_at: data.updated_at.getTime(),
      updated_by: '',
    });
  }

  async update(id: string, body: any): Promise<SingleUomDto> {
    try {
      await this.uomRep.update(id, body);
      const data = await this.uomRep.findOne({
        select: ['_id', 'name', 'updated_at', 'created_at', 'description'],
        where: { _id: id },
      });
      const { ...rest } = data;
      return new SingleUomDto({
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
      return await this.uomRep.softDelete(id);
    } catch (err) {
      return err;
    }
  }
}
