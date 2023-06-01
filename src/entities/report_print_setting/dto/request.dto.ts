import { IsString } from "class-validator";

export class PrintReportSettingDto {
    @IsString()
    laboratory_id!: string;
  
    @IsString()
    margin_top!: string;
  
    @IsString()
    margin_right!: string;
  
    @IsString()
    margin_left!: string;
  
    @IsString()
    margin_bottom!: string;
  
    @IsString()
    header_image_name!: string;
  
    @IsString()
    footer_image_name!: string;
  
    @IsString()
    header_text!: string;
  
    @IsString()
    footer_text!: string;
  
    @IsString()
    default_header_type!: string;
  
    @IsString()
    default_footer_type!: string;
  
    @IsString()
    default_download_header_type!: string;
  
    @IsString()
    default_download_footer_type!: string;
}