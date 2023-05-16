import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { SpecimenRequestDto } from '../dto/request.dto';
import { SingleSpecimenDto, SpecimenDto } from '../dto/response.dto';
import { specimen } from '../specimen.entity';

@Injectable()
export class SpecimensService {
  constructor(
    @InjectRepository(specimen) private specimenRep: Repository<specimen>,
  ) {}

  async getSpecimens(
    skip: number,
    take: number,
    text?: string,
  ): Promise<SpecimenDto[]> {
    let where: any = {}; // Declare an empty where object

    if (text) {
      where = [{ name: Like(`%${text}%`) }, { description: Like(`%${text}%`) }];
    }
    const specimens = await this.specimenRep.find({
      select: ['_id', 'name', 'description'],
      where,
      skip,
      take,
    });
    return specimens;
  }

  async getAll(): Promise<SpecimenDto[]> {
    const specimens = await this.specimenRep.find({
      select: ['_id', 'name', 'description'],
    });
    return specimens;
  }

  async updateSpecimen(
    id: string,
    data: SpecimenRequestDto,
  ): Promise<SingleSpecimenDto> {
    try {
      await this.specimenRep.update(id, data);
      const savedSpecimen = await this.specimenRep.findOne({
        select: ['_id', 'name', 'description'],
        where: { _id: id },
      });
      const { ...rest } = savedSpecimen;
      return new SingleSpecimenDto({
        ...rest,
        created_at: savedSpecimen.created_at.getTime(),
        updated_at: savedSpecimen.updated_at.getTime(),
        updated_by: '',
      });
    } catch (err) {
      return err;
    }
  }

  async addSpecimen(data: SpecimenRequestDto): Promise<SingleSpecimenDto> {
    try {
      const specimen = await this.specimenRep.save(data);
      const { ...rest } = specimen;
      return new SingleSpecimenDto({
        ...rest,
        created_at: specimen.created_at.getTime(),
        updated_at: specimen.updated_at.getTime(),
        updated_by: '',
      });
    } catch (err) {
      return err;
    }
  }

  async deleteSpecimen(id: any): Promise<any> {
    try {
      return await this.specimenRep.softDelete(id);
    } catch (err) {
      return err;
    }
  }
}
