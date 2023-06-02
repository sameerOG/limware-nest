import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reference } from '../reference.entity';
import { ReferencesListResponseDto } from './dto/response.dto';

@Injectable()
export class ReferencesService {
  constructor(
    @InjectRepository(Reference)
    private referenceRep: Repository<Reference>,
  ) {}

  create(createReferenceDto) {
    return 'This action adds a new reference';
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

  findOne(id: string) {
    return `This action returns a #${id} reference`;
  }

  update(id: string, updateReferenceDto) {
    return `This action updates a #${id} reference`;
  }

  remove(id: number) {
    return `This action removes a #${id} reference`;
  }
}
