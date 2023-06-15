import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import jwtDecode from 'jwt-decode';
import { AuthService } from 'src/entities/auth/auth.service';
import { CreateUserRequestDto } from 'src/entities/auth/dto/request.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { FacilityUserRequestDto, UserRequestDto } from '../dto/request.dto';
import {
  SingleFacilityUserDto,
  SingleUserDto,
  UserDto,
} from '../dto/response.dto';
import { UsersService } from './users.service';
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Get('/')
  async getUsers(
    @Res() response: Response,
    @Query() query,
    @Headers('Authorization') authHeader: string,
  ): Promise<UserDto[]> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const sort = query['sort'];
      const text = query.filter?.username?.like;
      const skip = (page - 1) * perpage;

      let data = await this.userService.getUsers(
        loggedInUser,
        skip,
        perpage,
        text,
        sort,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send({ error: err, message: 'Users not found' });
    }
  }

  @Get('/reload-logged-in-user-permissions')
  async reLoggedInUserPermissions(
    @Res() response: Response,
    @Query() query,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser: any = jwtDecode(token);
      const data = await this.userService._getEmployeeFacilities(
        loggedInUser.facility_id,
      );
      response.status(200).send(data);
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'User not found' });
    }
  }

  @Get('/:id')
  async getUser(
    @Res() response: Response,
    @Param('id') id,
    @Query() query,
  ): Promise<SingleUserDto> {
    try {
      const lab_id = query['laboratory_id'];
      let data;
      if (lab_id) {
        data = await this.userService.getLabUsers(lab_id);
      } else {
        data = await this.userService.getUser(id);
      }
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException({ err: true, messages: 'User not found' }, 422);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'User not found' });
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
        throw new HttpException(
          { err: true, messages: 'User not updated' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send(err);
    }
  }

  @Post('/create')
  async add(
    @Res() response: Response,
    @Body() body: any,
  ): Promise<SingleUserDto> {
    try {
      if (!body.portal) {
        body.portal = 'limware';
      }
      let data;
      if (body.portal === 'limware') {
        data = await this.authService.createNewUser(body);
      } else {
        data = await this.userService.addUser(body);
      }
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException({ err: true, messages: 'User not added' }, 422);
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send(
          err[0] && err[0].field
            ? err
            : { error: err, message: 'Employee not updated' },
        );
    }
  }

  @Post('/create-facility-user')
  async addFacilityUser(
    @Res() response: Response,
    @Body() body: FacilityUserRequestDto,
    @Headers('Authorization') authHeader: string,
  ): Promise<SingleUserDto> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.userService.addFacilityUser(body, loggedInUser);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Facility User not added' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send(err);
    }
  }

  @Post('/')
  async create(
    @Res() response: Response,
    @Body() body: any,
  ): Promise<SingleUserDto> {
    try {
      if (!body.portal) {
        body.portal = 'limware';
      }
      let data = await this.authService.createNewUser(body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException({ err: true, messages: 'User not added' }, 422);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'User not added' });
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
        throw new HttpException(
          { err: true, messages: 'User not deleted' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'User not deleted' });
    }
  }
}
