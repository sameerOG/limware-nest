import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Feature } from '../feature.entity';
import { FeatureRequestDto } from './dto/request.dto';
import {
  AppFeatureResponseDto,
  SingleAppFeatureResponseDto,
} from './dto/response.dto';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(Feature) private featureRep: Repository<Feature>,
  ) {}

  async getAll(
    skip: number,
    take: number,
    text?: string,
  ): Promise<AppFeatureResponseDto[]> {
    let where: any = {}; // Declare an empty where object
    if (text) {
      where = [{ title: Like(`%${text}%`) }];
    }
    const features = await this.featureRep.find({
      select: ['_id', 'title', 'is_published'],
      where,
      skip,
      take,
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
