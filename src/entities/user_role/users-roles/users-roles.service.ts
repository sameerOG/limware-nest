import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/user/user.entity';
import { Repository } from 'typeorm';
import { UserRoleRequestDto, UserRoleResponseDto } from '../dto/request.dto';
import { UserRoleDto } from '../dto/response.dto';
import { UserRole } from '../user_role.entity';

@Injectable()
export class UsersRolesService {
  constructor(
    @InjectRepository(UserRole) private userRoleRep: Repository<UserRole>,
    @InjectRepository(Users) private usersRep: Repository<Users>,
  ) {}

  async getUsersByRole(
    skip: number,
    take: number,
    role_id: string,
  ): Promise<UserRoleDto[]> {
    try {
      const userRoles = await this.userRoleRep
        .createQueryBuilder('user_role')
        .select('user_role.*')
        .skip(skip)
        .take(take)
        .where({ role_id: role_id })
        .getRawMany();
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
