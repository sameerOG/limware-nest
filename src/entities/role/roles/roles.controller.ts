import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  Headers,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import jwtDecode from 'jwt-decode';
import { AuthGuard } from 'src/guard/auth.guard';
import { AssignPermissionRequest, RoleRequestDto } from '../dto/request.dto';
import { RoleDto, SingleRoleDto } from '../dto/response.dto';
import { Role } from '../role.entity';
import { RolesService } from './roles.service';
@Controller('roles')

// @UseGuards(AuthGuard)
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Get('/get-by-portal')
  async getByPortal(
    @Res() response: Response,
    @Query() query,
    @Headers('Authorization') authHeader: string,
  ): Promise<Role[]> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const portal = query['portal'];
      let data = await this.roleService.getByPortal(portal, loggedInUser);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Roles not found' });
    }
  }

  @Get('/get-permissions')
  async getPermissions(
    @Res() response: Response,
    @Query() query,
  ): Promise<any> {
    try {
      const role_id = query['role_id'];
      const portal = query['portal'];
      let data = await this.roleService.getPermissions(role_id, portal);
      if (data) {
        response.status(200).send(data);
      } else {
        throw new HttpException(
          { err: true, messages: 'Permissions not found' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Permissions not found' });
    }
  }

  @Post('/assign-permissions')
  async assignPermissions(
    @Res() response: Response,
    @Body() body: AssignPermissionRequest,
  ): Promise<Role> {
    try {
      let data = await this.roleService.assignPermissions(body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Permissions not assigned' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Permissions not assigned' });
    }
  }

  @Get('/')
  async getRoles(
    @Res() response: Response,
    @Query() query,
  ): Promise<RoleDto[]> {
    try {
      const perpage = query['per-page'];
      const page = query['page'];
      const sort = query['sort'];
      const text = query.filter?.name?.like;
      const skip = (page - 1) * perpage;

      let data = await this.roleService.getRoles(skip, perpage, text, sort);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Roles not found' });
    }
  }

  @Get('/:id')
  async getUser(
    @Res() response: Response,
    @Param('id') id,
  ): Promise<SingleRoleDto> {
    try {
      let data = await this.roleService.getRole(id);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException({ err: true, messages: 'Role not found' }, 422);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'ROle not found' });
    }
  }

  @Put('/:id')
  async update(
    @Res() response: Response,
    @Body() body: RoleRequestDto,
    @Param('id') id,
  ): Promise<SingleRoleDto> {
    try {
      let data = await this.roleService.updateRole(id, body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Role not updated' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Role not updated' });
    }
  }

  @Post('/')
  async add(
    @Res() response: Response,
    @Body() body: RoleRequestDto,
  ): Promise<SingleRoleDto> {
    try {
      let data = await this.roleService.addRole(body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException({ err: true, messages: 'Role not added' }, 422);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Role not added' });
    }
  }

  @Delete('/:id')
  async delete(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<any> {
    try {
      let data = await this.roleService.deleteRole(id);
      if (data.affected > 0) {
        response.status(204).send('Role deleted successfully');
      } else {
        throw new HttpException(
          { err: true, messages: 'Role not deleted' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Role not deleted' });
    }
  }
}
