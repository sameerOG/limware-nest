import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PricingPlanRequestDto } from '../dto/request.dto';
import { PricingPlanResponseDto } from '../dto/response.dto';
import { PricingPlan } from '../pricing_plan.entity';

@Injectable()
export class PricingPlansService {
  constructor(
    @InjectRepository(PricingPlan)
    private pricingPlanRep: Repository<PricingPlan>,
  ) {}

  async getAll(
    skip: number,
    take: number,
    text?: string,
  ): Promise<PricingPlanResponseDto[]> {
    let where: any = {}; // Declare an empty where object
    if (text) {
      where = [{ title: Like(`%${text}%`) }];
    }
    const pricingPlans = await this.pricingPlanRep.find({
      select: [
        '_id',
        'title',
        'is_published',
        'discount',
        'packages',
        'plan_for',
        'plan_type',
        'created_at',
        'updated_at',
      ],
      where,
      skip,
      take,
    });
    return pricingPlans;
  }

  async getSingle(id: string): Promise<PricingPlanResponseDto> {
    let where: any = {}; // Declare an empty where object
    if (id) {
      where = { _id: id };
    }
    const pricingPlan = await this.pricingPlanRep.findOne({
      select: [
        '_id',
        'title',
        'is_published',
        'discount',
        'packages',
        'plan_for',
        'plan_type',
        'created_at',
        'updated_at',
      ],
      where,
    });
    const { ...rest } = pricingPlan;
    return new PricingPlanResponseDto({
      ...rest,
      created_at: pricingPlan.created_at.getTime(),
      updated_at: pricingPlan.updated_at.getTime(),
    });
  }

  async add(body: PricingPlanRequestDto): Promise<PricingPlanResponseDto> {
    const pricingPlan = await this.pricingPlanRep.save(body);
    const { ...rest } = pricingPlan;
    return new PricingPlanResponseDto({
      ...rest,
      created_at: pricingPlan.created_at.getTime(),
      updated_at: pricingPlan.updated_at.getTime(),
    });
  }
}
