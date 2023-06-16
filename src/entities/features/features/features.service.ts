import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/baseService';
import { transformSortField } from 'src/common/utils/transform-sorting';
import { Like, Repository } from 'typeorm';
import { Feature } from '../feature.entity';
import { FeatureRequestDto } from './dto/request.dto';
import {
  AppFeatureResponseDto,
  SingleAppFeatureResponseDto,
} from './dto/response.dto';

@Injectable()
export class FeaturesService {
  private featureRep: BaseService<Feature>;
  constructor(
    @InjectRepository(Feature) private featureRepository: Repository<Feature>,
  ) {
    this.featureRep = new BaseService<Feature>(this.featureRepository);
  }

  async getAll(
    skip: number,
    take: number,
    text?: string,
    sort?: string,
  ): Promise<AppFeatureResponseDto[]> {
    let where: any = {}; // Declare an empty where object
    if (text) {
      where = [{ title: Like(`%${text}%`) }];
    }
    const features = await this.featureRep.findAll({
      select: ['_id', 'title', 'is_published'],
      where,
      skip,
      take,
      order: transformSortField(sort),
    });
    return features;
  }

  async getSingle(id: string): Promise<SingleAppFeatureResponseDto> {
    let where: any = {}; // Declare an empty where object
    if (id) {
      where = { _id: id };
    }
    const feature = await this.featureRep.findOne({
      select: [
        '_id',
        'title',
        'is_published',
        'content',
        'date_created',
        'date_modified',
      ],
      where,
    });
    const { ...rest } = feature;
    return new SingleAppFeatureResponseDto({
      ...rest,
      created_at: feature.date_created.getTime(),
      updated_at: feature.date_modified.getTime(),
    });
  }

  async add(body: FeatureRequestDto): Promise<SingleAppFeatureResponseDto> {
    const feature = await this.featureRep.save(body);
    const { ...rest } = feature;
    return new SingleAppFeatureResponseDto({
      ...rest,
      created_at: feature.date_created.getTime(),
      updated_at: feature.date_modified.getTime(),
    });
  }

  async update(
    id: string,
    body: FeatureRequestDto,
  ): Promise<SingleAppFeatureResponseDto> {
    await this.featureRep.update(id, body);
    let where: any = {}; // Declare an empty where object
    if (id) {
      where = { _id: id };
    }
    const savedFeature = await this.featureRep.findOne({
      select: [
        '_id',
        'title',
        'is_published',
        'content',
        'date_created',
        'date_modified',
      ],
      where,
    });
    const { ...rest } = savedFeature;
    return new SingleAppFeatureResponseDto({
      ...rest,
      created_at: savedFeature.date_created.getTime(),
      updated_at: savedFeature.date_modified.getTime(),
    });
  }

  async delete(id: string): Promise<any> {
    return await this.featureRep.delete(id);
  }
}
