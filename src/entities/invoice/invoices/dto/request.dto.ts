import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddPaymentRequestDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  type: number;

  @IsString()
  @IsNotEmpty()
  invoice_id: string;

  @IsString()
  @IsOptional()
  user_comment: string;
}

export class AddDiscountRequestDto {
  @IsNumber()
  @IsNotEmpty()
  discount_amount: number;

  @IsString()
  @IsNotEmpty()
  invoice_id: string;

  @IsString()
  @IsOptional()
  user_comment: string;
}
