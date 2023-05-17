import {
  Body,
  Controller,
  Post,
  Res,
  Headers,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import * as moment from 'moment';
import * as uuid from 'uuid';
let uniqueId = uuid.v4();
import { AuthService } from './auth.service';
import { Response } from 'express';
import {
  AuthRequest,
  ChangePasswordRequest,
  LoginIntoFacility,
  ProfileRequest,
  RegisterRequest,
  ValidateOtpRequest,
} from './dto/request.dto';
import { AuthDto, AuthRegisterDto, ProfileResponse } from './dto/response.dto';
import jwtDecode from 'jwt-decode';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { promisify } from 'util';
import { existsSync, mkdirSync, mkdir, writeFile } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  addFileName,
  imageFileFilter,
} from 'src/common/utils/file-upload.util';
import { Error } from 'src/common/global-dto.dto';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/accounts/login')
  async login(
    @Res() response: Response,
    @Body() body: AuthRequest,
  ): Promise<AuthDto | Error[]> {
    try {
      let data = await this.authService.login(body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        response.status(422).send({});
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send(err);
    }
  }

  @Get('/profile')
  async getProfile(
    @Res() response: Response,
    @Headers('Authorization') authHeader: string,
  ): Promise<ProfileResponse> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.authService.getProfile(
        loggedInUser['user_id']['$oid'],
      );
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

  @Post('/profile/update-profile')
  @UseInterceptors(
    FileInterceptor('profile_image_file', {
      storage: diskStorage({
        destination: 'src/common/uploads',
        filename: addFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async updateProfile(
    @Res() response: Response,
    @Body() body: any,
    @UploadedFile() file,
    @Headers('Authorization') authHeader: string,
  ): Promise<ProfileResponse> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const fileData = file.filename;
      let parsedData = JSON.parse(body.data);
      Object.assign(parsedData, { profile_image_name: fileData });
      let data = await this.authService.updateProfile(parsedData, loggedInUser);
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

  @Get('/profile/get-profile-image')
  async getProfileImage(
    @Res() response: Response,
    @Headers('Authorization') authHeader: string,
  ): Promise<boolean> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const profile = await this.authService.getProfileImage(loggedInUser);
      response.status(200).send(profile);
      return true;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
    }
  }

  @Post('/profile/change-loggedin-user-password')
  async changePassword(
    @Res() response: Response,
    @Body() body: ChangePasswordRequest,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const data = await this.authService.changePassword(body, loggedInUser);
      response.status(200).send(data);
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send(err);
    }
  }

  @Post('/accounts/logout')
  async logout(
    @Res() response: Response,
    @Headers('Authorization') authHeader: string,
  ): Promise<boolean> {
    try {
      const token = authHeader.split(' ')[1];
      let data = await this.authService.logout(token);
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

  @Post('/accounts/login-into-facility')
  async loginToFacility(
    @Res() response: Response,
    @Body() body: LoginIntoFacility,
  ): Promise<boolean> {
    try {
      let data = await this.authService.loginIntoFacility(body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        response.status(400).send(data);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({});
    }
  }

  @Post('/registrations')
  async register(
    @Res() response: Response,
    @Body() body: RegisterRequest,
  ): Promise<AuthRegisterDto> {
    try {
      let data = await this.authService.register(body);
      if (data) {
        const statusCode: number = !data?.errors ? 200 : 400;
        response.status(statusCode).send(data);
        return data;
      } else {
        response.status(422).send(data);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send(err);
    }
  }

  @Post('/registrations/validate-verification-pin')
  async verifyOtp(
    @Res() response: Response,
    @Body() body: ValidateOtpRequest,
  ): Promise<any> {
    try {
      let data = await this.authService.validateOtp(body);
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
}
