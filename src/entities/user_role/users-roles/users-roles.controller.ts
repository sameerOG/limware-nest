import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersRolesService } from './users-roles.service';
import { Response } from 'express';
import { UserRoleDto } from '../dto/response.dto';
import { UserRoleRequestDto, UserRoleResponseDto } from '../dto/request.dto';
import { AuthGuard } from 'src/guard/auth.guard';
@Controller('users-roles')
@UseGuards(AuthGuard)
export class UsersRolesController {
  constructor(private userRoleService: UsersRolesService) {}

  @Get('/find-by-role')
  async getUserRoles(
    @Res() response: Response,
    @Query() query,
  ): Promise<UserRoleDto[]> {
    try {
      const perpage = query['per-page'];
      const page = query['page'];
      const role_id = query['role_id'];
      const skip = (page - 1) * perpage;

      let data = await this.userRoleService.getUsersByRole(
        skip,
        perpage,
        role_id,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Users not found' });
    }
  }

  @Post('/')
  async addUserRoles(
    @Res() response: Response,
    @Body() body: UserRoleRequestDto,
  ): Promise<UserRoleResponseDto> {
    try {
      let data = await this.userRoleService.addUserRole(body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'User Role not added' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'User Role not added' });
    }
  }

  @Delete('/:id')
  async deleteUserRole(@Res() response: Response, @Param('id') id: string) {
    try {
      await this.userRoleService.deleteUserRole(id);
      response.status(204).send('User role deleted successfully');
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'User Role not deleted' });
    }
  }
}
