import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Addons } from '../addons.entity';
import { AddonsRequest } from '../dto/request.dto';
import { AddonDto } from '../dto/response.dto';

@Injectable()
export class AddonsService {
  constructor(
    @InjectRepository(Addons)
    private addonRep: Repository<Addons>,
  ) {}

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
}
