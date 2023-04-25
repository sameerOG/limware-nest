import { IsObject } from 'class-validator';

export class AddonsRequest {
  @IsObject()
  sms: {
    status: boolean;
    settings: {
      registration: boolean;
      payment_done: boolean;
      reports_done: boolean;
    };
  };

  @IsObject()
  whatsapp: {
    status: boolean;
    settings: {
      registration: boolean;
      payment_done: boolean;
      reports_done: boolean;
    };
  };
}
