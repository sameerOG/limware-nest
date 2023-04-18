import { IsString, IsNotEmpty, IsEmail, IsNumber, IsOptional } from "class-validator";

export class UserRequestDto {
    @IsString()
    @IsNotEmpty()
    full_name: string;
  
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsNumber()
    @IsNotEmpty()
    status: number;
  
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsNumber()
    @IsOptional()
    isSuperUser:number

    @IsString()
    @IsNotEmpty()
    portal: string;

    @IsString()
    @IsOptional()
    password: string;

    @IsString()
    @IsOptional()
    password_hash: string;

    @IsString()
    @IsNotEmpty()
    mobile_number: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    city: string;
}