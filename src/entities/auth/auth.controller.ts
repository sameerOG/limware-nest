import { Body, Controller, Post, Res, Headers, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import {
  AuthRequest,
  LoginIntoFacility,
  RegisterRequest,
  ValidateOtpRequest,
} from './dto/request.dto';
import { AuthDto, AuthRegisterDto, ProfileResponse } from './dto/response.dto';
import jwtDecode from 'jwt-decode';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/accounts/login')
  async login(
    @Res() response: Response,
    @Body() body: AuthRequest,
  ): Promise<AuthDto> {
    try {
      let data = await this.authService.login(body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        response.status(400).send({});
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send({});
    }
  }

  @Get('/profile')
  async getProfile(
    @Res() response: Response,
    @Headers('Authorization') authHeader: string,
  ): Promise<ProfileResponse> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token)
      let data = await this.authService.getProfile(loggedInUser['user_id']['$oid']);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        response.status(400).send({});
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send({});
    }
  }

  @Get('/profile/get-profile-image')
  async getProfileImage(
    @Res() response: Response,
    @Headers('Authorization') authHeader: string,
  ): Promise<boolean> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token)
      response.status(200).send(true);
      return true
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send({});
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
        response.status(400).send({});
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send({});
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
      response.status(400).send({});
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
        response.status(400).send({});
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send({});
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
        response.status(400).send({});
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(400).send({});
    }
  }
}
