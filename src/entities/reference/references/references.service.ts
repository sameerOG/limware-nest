import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reference } from '../reference.entity';
import { ReferenceRequestDto } from './dto/request.dto';
import {
  ReferencesCreateResponseDto,
  ReferencesListResponseDto,
} from './dto/response.dto';

@Injectable()
export class ReferencesService {
  constructor(
    @InjectRepository(Reference)
    private referenceRep: Repository<Reference>,
  ) {}

  async create(body: any): Promise<ReferencesCreateResponseDto> {
    const data = await this.referenceRep.save(body);
    if (data) {
      const { created_at, updated_at, ...rest } = data;
      return new ReferencesCreateResponseDto({
        created_at: created_at.getTime(),
        updated_at: updated_at.getTime(),
        ...rest,
      });
    }
  }

  async getAll(user): Promise<ReferencesListResponseDto[]> {
    return await this.referenceRep
      .createQueryBuilder('reference')
      .select('reference._id,reference.name')
      .where('reference.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawMany();
  }

  async findOne(id: string): Promise<ReferencesCreateResponseDto> {
    const data = await this.referenceRep.findOne({ where: { _id: id } });
    const { created_at, updated_at, ...rest } = data;
    return new ReferencesCreateResponseDto({
      created_at: created_at.getTime(),
      updated_at: updated_at.getTime(),
      ...rest,
    });
  }

  async update(id: string, body: any): Promise<ReferencesCreateResponseDto> {
    const data = await this.referenceRep.update(id, body);
    const savedData = await this.referenceRep.findOne({ where: { _id: id } });
    if (data) {
      const { created_at, updated_at, ...rest } = savedData;
      return new ReferencesCreateResponseDto({
        created_at: created_at.getTime(),
        updated_at: updated_at.getTime(),
        ...rest,
      });
    }
  }

  async remove(id: string): Promise<any> {
    return await this.referenceRep.softDelete(id);
  }
}
