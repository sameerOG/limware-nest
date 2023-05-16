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
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleRequestDto } from '../dto/request.dto';
import { RoleDto, SingleRoleDto } from '../dto/response.dto';
import { RolesService } from './roles.service';
@Controller('roles')
@UseGuards(AuthGuard)
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Get('/')
  async getUsers(
    @Res() response: Response,
    @Query() query,
  ): Promise<RoleDto[]> {
    try {
      const perpage = query['per-page'];
      const page = query['page'];
      const text = query.filter?.name?.like;
      const skip = (page - 1) * perpage;

      let data = await this.roleService.getRoles(skip, perpage, text);
      if (data?.length > 0) {
        response.status(200).send(data);
        return data;
      } else {
        response.status(422).send([]);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send([]);
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
        response.status(422).send({});
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
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
        response.status(422).send([]);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
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
        response.status(422).send([]);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
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
        response.status(204).send('User deleted successfully');
      } else {
        response.status(422).send([]);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
    }
  }
}
