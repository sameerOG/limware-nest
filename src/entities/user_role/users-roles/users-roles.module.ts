import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/user/user.entity';
import { UserRole } from '../user_role.entity';
import { UsersRolesController } from './users-roles.controller';
import { UsersRolesService } from './users-roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole, Users])],
  controllers: [UsersRolesController],
  providers: [UsersRolesService],
})
export class UsersRolesModule {}
