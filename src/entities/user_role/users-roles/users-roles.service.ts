import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/baseService';
import { Users } from 'src/entities/user/user.entity';
import { Repository } from 'typeorm';
import { UserRoleRequestDto, UserRoleResponseDto } from '../dto/request.dto';
import { UserRoleDto } from '../dto/response.dto';
import { UserRole } from '../user_role.entity';

@Injectable()
export class UsersRolesService {
  private userRoleRep: BaseService<UserRole>;
  private usersRep: BaseService<Users>;

  constructor(
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {
    this.userRoleRep = new BaseService<UserRole>(this.userRoleRepository);
    this.usersRep = new BaseService<Users>(this.usersRepository);
  }

  async getUsersByRole(
    skip: number,
    take: number,
    role_id: string,
  ): Promise<UserRoleDto[]> {
    try {
      const userRoles = await this.userRoleRep.findAll({
        skip,
        take,
        where: {
          role_id,
        },
      });
      let user_roles_arr = [];
      for (let i = 0; i < userRoles.length; i++) {
        let user_role = userRoles[i];
        const user = await this.usersRep.findOne({
          select: [
            '_id',
            'email',
            'full_name',
            'mobile_number',
            'portal',
            'status',
            'username',
          ],
          where: { _id: user_role.user_id },
        });
        user_roles_arr.push({
          _id: role_id,
          user: user,
        });
      }
      return user_roles_arr;
    } catch (err) {
      return [];
    }
  }

  async addUserRole(data: UserRoleRequestDto): Promise<UserRoleResponseDto> {
    const user_role = await this.userRoleRep.save(data);
    const { ...rest } = user_role;
    return new UserRoleResponseDto({
      ...rest,
      created_at: user_role.created_at.getTime(),
      updated_at: user_role.updated_at.getTime(),
      _id: user_role.id,
      created_by: '',
      updated_by: '',
    });
  }

  async deleteUserRole(id: string) {
    return await this.userRoleRep.softDelete({
      role_id: id,
    });
  }
}
