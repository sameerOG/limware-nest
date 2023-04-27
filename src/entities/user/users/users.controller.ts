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
import { UserRequestDto } from '../dto/request.dto';
import { SingleUserDto, UserDto } from '../dto/response.dto';
import { UsersService } from './users.service';
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/')
  async getUsers(
    @Res() response: Response,
    @Query() query,
  ): Promise<UserDto[]> {
    try {
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const text = query.filter?.username?.like;
      const skip = (page - 1) * perpage;
      console.log('query', query);

      let data = await this.userService.getUsers(skip, perpage, text);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send([]);
    }
  }

  @Get('/:id')
  async getUser(
    @Res() response: Response,
    @Param('id') id,
  ): Promise<SingleUserDto> {
    try {
      let data = await this.userService.getUser(id);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        response.status(400).send([]);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send([]);
    }
  }

  @Put('/:id')
  async update(
    @Res() response: Response,
    @Body() body: UserRequestDto,
    @Param('id') id,
  ): Promise<SingleUserDto> {
    try {
      let data = await this.userService.updateUser(id, body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        response.status(400).send([]);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send({});
    }
  }

  @Post('/create')
  async add(
    @Res() response: Response,
    @Body() body: UserRequestDto,
  ): Promise<SingleUserDto> {
    try {
      let data = await this.userService.addUser(body);
      console.log('data', data);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        response.status(400).send([]);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send({});
    }
  }

  @Delete('/:id')
  async delete(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<any> {
    try {
      let data = await this.userService.deleteUser(id);
      if (data.affected > 0) {
        response.status(204).send('User deleted successfully');
      } else {
        response.status(400).send([]);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send({});
    }
  }
}
