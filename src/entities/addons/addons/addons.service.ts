import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/baseService';
import { Repository } from 'typeorm';
import { Addons } from '../addons.entity';
import { AddonsRequest } from '../dto/request.dto';
import { AddonDto } from '../dto/response.dto';

@Injectable()
export class AddonsService {
  private addonRep: BaseService<Addons>;

  constructor(
    @InjectRepository(Addons)
    private addonRepository: Repository<Addons>,
  ) {
    this.addonRep = new BaseService<Addons>(this.addonRepository);
  }

  async getAllByFacility(facility_id: string): Promise<AddonDto> {
    const data: any = await this.addonRep.findOne({
      where: { facility_id: facility_id },
    });
    const { ...rest } = data;
    return new AddonDto({
      ...rest,
      updated_by: '',
    });
  }

  async update(facility_id: string, body: any): Promise<AddonDto> {
    const data: any = await this.addonRep.findOne({
      where: { facility_id: facility_id },
    });
    if (data) {
      await this.addonRep.update({ facility_id: facility_id }, body);
    } else {
      body.facility_id = facility_id;
      await this.addonRep.save(body);
    }
    const { ...rest } = data;
    return new AddonDto({
      ...rest,
      updated_by: '',
    });
  }
  async getMyAddOns(facility_id): Promise<Addons | undefined> {
    return await this.addonRep.findOne({ where: { facility_id: facility_id } });
  }
}
