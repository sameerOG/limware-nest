import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { RoleRequestDto } from '../dto/request.dto';
import { RoleDto, SingleRoleDto } from '../dto/response.dto';
import { Role } from '../role.entity';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private rolesRep: Repository<Role>) {}

  async getRoles(
    skip: number,
    take: number,
    text?: string,
  ): Promise<RoleDto[]> {
    let where: any = {};

    if (text) {
      where.name = Like(`%${text}%`);
    }
    const roles = await this.rolesRep.find({
      select: ['_id', 'name', 'portal', 'status'],
      skip,
      take,
      where,
    });
    return roles;
  }

  async getRole(id: string): Promise<SingleRoleDto> {
    const role = await this.rolesRep.findOne({
      select: [
        '_id',
        'portal',
        'status',
        'key',
        'name',
        'permissions',
        'system_role',
        'updated_at',
        'created_at',
      ],
      where: { _id: id },
    });
    const { ...rest } = role;
    return new SingleRoleDto({
      ...rest,
      created_at: role.created_at.getTime(),
      updated_at: role.updated_at.getTime(),
      updated_by: '',
    });
  }

  async updateRole(id: string, data: RoleRequestDto): Promise<SingleRoleDto> {
    try {
      await this.rolesRep.update(id, data);
      const savedRole = await this.rolesRep.findOne({
        select: [
          '_id',
          'portal',
          'status',
          'key',
          'name',
          'permissions',
          'system_role',
          'updated_at',
          'created_at',
        ],
        where: { _id: id },
      });
      const { ...rest } = savedRole;
      return new SingleRoleDto({
        ...rest,
        created_at: savedRole.created_at.getTime(),
        updated_at: savedRole.updated_at.getTime(),
        updated_by: '', // set created_at field as timestamp
      });
    } catch (err) {
      return err;
    }
  }

  async addRole(data: RoleRequestDto): Promise<SingleRoleDto> {
    try {
      const role = await this.rolesRep.save(data);
      const { ...rest } = role;
      return new SingleRoleDto({
        ...rest,
        created_at: role.created_at.getTime(),
        updated_at: role.updated_at.getTime(),
        updated_by: '',
      });
    } catch (err) {
      return err;
    }
  }

  async deleteRole(id: any): Promise<any> {
    try {
      return await this.rolesRep.softDelete(id);
    } catch (err) {
      return err;
    }
  }
}
