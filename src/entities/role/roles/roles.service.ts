import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  administrationFeatures,
  limwareFeatures,
} from 'src/common/helper/enums';
import { transformSortField } from 'src/common/utils/transform-sorting';
import { Like, Repository } from 'typeorm';
import { AssignPermissionRequest, RoleRequestDto } from '../dto/request.dto';
import { RoleDto, SingleRoleDto } from '../dto/response.dto';
import { Role } from '../role.entity';

@Injectable()
export class RolesService {
  private newPermissions = [];
  constructor(@InjectRepository(Role) private rolesRep: Repository<Role>) {}

  async getRoles(
    skip: number,
    take: number,
    text?: string,
    sort?: string,
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
      order: transformSortField(sort),
    });
    return roles;
  }

  async assignPermissions(body: AssignPermissionRequest): Promise<Role> {
    this.newPermissions = [];
    const model: any = await this.rolesRep.findOne({
      where: { _id: body.role_id },
    });
    let dataSet;
    if (model?.portal === 'administration') {
      dataSet = administrationFeatures;
    } else if (model?.portal === 'limware') {
      dataSet = limwareFeatures;
    } else {
      dataSet = [];
    }
    body.permissions.forEach(async (item) => {
      if (!(await this.alreadyExist(item.id, item.parent_id))) {
        item.status = true;
        this.newPermissions.push(item);
      }
      await this.__assignPermissions(dataSet, item.id, item.module_id);
    });
    model.permissions = this.newPermissions;
    await this.rolesRep.update(model._id, model);
    return model;
  }

  async __assignPermissions(dataset, parent_id: string, module_id: string) {
    dataset.forEach(async (item) => {
      if (item.parent_id === parent_id) {
        if (!(await this.alreadyExist(item.id, item.parent_id))) {
          this.newPermissions.push({
            id: item.id,
            parent_id: item.parent_id,
            module_id,
            status: true,
          });
        }
        this.__assignPermissions(dataset, item.id, module_id);
      }
    });
  }

  async alreadyExist(id: string, parent_id: string) {
    this.newPermissions.forEach((item) => {
      if (item.id === id && item.parent_id === parent_id) {
        return true;
      }
    });
    return false;
  }

  async getPermissions(role_id: string, portal: string): Promise<any> {
    const role: any = await this.rolesRep.findOne({ where: { _id: role_id } });
    if (role) {
      const moduleFeatures = await this.getPermissionsData(
        portal,
        role.permissions ? role.permissions : [],
      );
      return moduleFeatures;
    }
  }

  async getByPortal(portal: any, user): Promise<Role[]> {
    if (user.portal === 'limware') {
      portal = 'limware';
    }

    return await this.rolesRep.find({
      where: { portal },
      order: {
        name: 'ASC',
      },
    });
  }

  async getPermissionsData(portal, permissions) {
    let dataSet = [];
    if (portal === 'administration') {
      dataSet = administrationFeatures;
    } else if (portal === 'limware') {
      dataSet = limwareFeatures;
    }
    return this.__getPermissions(dataSet, permissions);
  }

  async __getPermissions(data, assignedPermissions) {
    let moduleFeatures = [];
    const modules = await this.__getModules(data);
    for (let i = 0; i < modules.length; i++) {
      let moduleData = modules[i];
      for (let j = 0; j < data.length; j++) {
        let item = data[j];
        if (item.id == moduleData.id) {
          item.status = await this.__isAssigned(assignedPermissions, item.id);
          item.children = await this.__findChildren(
            data,
            moduleData.id,
            1,
            assignedPermissions,
          );
          moduleFeatures.push(item);
        }
      }
    }
    return moduleFeatures;
  }

  async __isAssigned(assignedPermissions, id) {
    return assignedPermissions.some((item) => {
      if (item.id == id) {
        return true;
      }
    });
    return false;
  }

  async __findChildren(data, parent_id, level, assignedPermissions) {
    if (level <= 2) {
      level++;
      let children = [];

      data.forEach(async (item) => {
        if (
          item.parent_id == parent_id &&
          (item.operation == '*' ||
            item.operation == 'r' ||
            item.operation == 'c' ||
            item.operation == 'u' ||
            item.operation == 'd')
        ) {
          let child_item = item;
          child_item.status = await this.__isAssigned(
            assignedPermissions,
            child_item.id,
          );
          child_item.children = await this.__findChildren(
            data,
            item.id,
            level,
            assignedPermissions,
          );
          children.push(child_item);
        }
      });
      return children;
    } else {
      return [];
    }
  }

  async __getModules(data) {
    let modules = [];
    data.forEach((item) => {
      if (!item.parent_id) {
        modules.push({ id: item.id, title: item.title });
      }
    });
    return modules;
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
