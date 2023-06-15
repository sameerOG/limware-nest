import {
  Body,
  Controller,
  Post,
  Res,
  Headers,
  Get,
  UseInterceptors,
  UploadedFile,
  HttpException,
} from '@nestjs/common';
import * as moment from 'moment';
import * as uuid from 'uuid';
let uniqueId = uuid.v4();
import { AuthService } from './auth.service';
import { Response } from 'express';
import {
  AuthRequest,
  ChangePasswordRequest,
  checkUserVerified,
  GenerateVerificationPinRequest,
  LoginIntoFacility,
  ProfileRequest,
  RegisterRequest,
  ValidateOtpRequest,
} from './dto/request.dto';
import {
  AuthDto,
  AuthRegisterDto,
  GenerateVerificationPinResponse,
  ProfileResponse,
  UserVeifiedResponse,
} from './dto/response.dto';
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
        response
          .status(422)
          .send({ error: true, message: 'Invalid Credentials' });
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
        throw new HttpException(
          { err: true, messages: 'Profile not found' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Profile not found' });
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
        throw new HttpException(
          { err: true, messages: 'Profile not updated' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Profile not updated' });
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
      response
        .status(422)
        .send({ error: err, message: 'Profile Image not found' });
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
      response
        .status(422)
        .send({ error: err, message: 'Password not changed' });
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
        throw new HttpException(
          { err: true, messages: 'Logout Unsuccessfull' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Logout Unsuccessfull' });
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
        throw new HttpException({ err: true, messages: 'User not found' }, 422);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'User not found' });
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
        throw new HttpException({ err: true, messages: 'User not added' }, 422);
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send(
          err[0] && err[0].field
            ? err
            : { error: err, message: 'Facility not added' },
        );
    }
  }

  @Post('/registrations/check-if-user-verified')
  async checkIfUserVerified(
    @Res() response: Response,
    @Body() body: checkUserVerified,
  ): Promise<UserVeifiedResponse> {
    try {
      let data = await this.authService.checkIfUserVerified(body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException({ err: true, messages: 'User not added' }, 422);
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'User not found' });
    }
  }

  @Post('/registrations/generate-verification-pin')
  async generateVerificationPin(
    @Res() response: Response,
    @Body() body: GenerateVerificationPinRequest,
  ): Promise<GenerateVerificationPinResponse> {
    try {
      let data = await this.authService.generateVerificationPin(body._id);
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
        throw new HttpException(
          { err: true, messages: 'Invalid Verification Code' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Invalid Verification Pin' });
    }
  }
}
