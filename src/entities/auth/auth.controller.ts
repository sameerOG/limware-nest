import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import {
  AuthRequest,
  LoginIntoFacility,
  RegisterRequest,
  ValidateOtpRequest,
} from './dto/request.dto';
import { AuthDto, AuthRegisterDto } from './dto/response.dto';

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
      console.log('data', data);
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
