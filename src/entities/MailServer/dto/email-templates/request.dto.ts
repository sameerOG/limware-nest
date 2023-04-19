import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class EmailTemplateRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsNotEmpty()
  outgoing_mail_server_id: string;
}
