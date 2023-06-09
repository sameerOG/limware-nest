import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AuthRequest {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsOptional()
  rememberMe: boolean;
}

export class ValidateOtpRequest {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsNumber()
  @IsNotEmpty()
  otp: number;
}

export class checkUserVerified {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class GenerateVerificationPinRequest {
  @IsString()
  @IsNotEmpty()
  _id: string;
}

export class RegisterRequest {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @IsString()
  @IsNotEmpty()
  laboratory_name: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  terms: boolean;

  @IsString()
  @IsOptional()
  email: string;
}

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  portal: string;

  @IsNotEmpty()
  status: number;

  @IsBoolean()
  @IsNotEmpty()
  terms: boolean;
}

export class LoginIntoFacility {
  @IsString()
  @IsNotEmpty()
  facility_id: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;
}

export class ProfileRequest {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  status: number;
}

export class ChangePasswordRequest {
  @IsString()
  @IsNotEmpty()
  confirm_password: string;

  @IsString()
  @IsNotEmpty()
  current_password: string;

  @IsString()
  @IsNotEmpty()
  new_password: string;
}
