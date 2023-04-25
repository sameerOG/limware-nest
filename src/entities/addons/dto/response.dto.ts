export class AddonDto {
  readonly _id: string;
  readonly facility_id: string;
  readonly sms: SMS_AND_WHATSAPP_SETTINGS;
  readonly whatsapp: SMS_AND_WHATSAPP_SETTINGS;
  readonly created_at: number;
  readonly updated_at: number;
  readonly updated_by: string;

  constructor(addons: AddonDto) {
    (this._id = addons._id),
      (this.created_at = addons.created_at),
      (this.updated_at = addons.updated_at),
      (this.updated_by = addons.updated_by),
      (this.sms = addons.sms),
      (this.whatsapp = addons.whatsapp);
  }
}

export class AddonRequestDto {
  sms: SMS_AND_WHATSAPP_SETTINGS;
  whatsapp: SMS_AND_WHATSAPP_SETTINGS;

  constructor(addons: AddonRequestDto) {
    (this.sms = addons.sms), (this.whatsapp = addons.whatsapp);
  }
}

export class SMS_AND_WHATSAPP_SETTINGS {
  readonly status: boolean;
  readonly settings: Settings;

  constructor(settings: SMS_AND_WHATSAPP_SETTINGS) {
    (this.status = settings.status), (this.settings = settings.settings);
  }
}

export class Settings {
  readonly payment_done: boolean;
  readonly registration: boolean;
  readonly reports_done: boolean;

  constructor(settings: Settings) {
    (this.payment_done = settings.payment_done),
      (this.registration = settings.registration),
      (this.reports_done = settings.reports_done);
  }
}
