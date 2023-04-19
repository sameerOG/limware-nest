export class OutgoingMailServersDto {
  readonly _id: string;
  readonly title: string;
  readonly is_default?: boolean;
  readonly host: string;
  readonly port: number;
  readonly encryption: string;
  readonly username: string;
  readonly password?: string;
  readonly updated_by?: string;
  readonly updated_at?: number | Date;
  readonly created_at?: number | Date;

  constructor(oms: OutgoingMailServersDto) {
    (this._id = oms._id),
      (this.title = oms.title),
      (this.host = oms.host),
      (this.port = oms.port),
      (this.encryption = oms.encryption),
      (this.username = oms.username),
      (this.password = oms.password),
      (this.updated_by = oms.updated_by),
      (this.updated_at = oms.updated_at),
      (this.created_at = oms.created_at),
      (this.is_default = oms.is_default);
  }
}
