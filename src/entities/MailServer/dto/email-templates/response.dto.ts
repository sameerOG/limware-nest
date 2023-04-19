export class EmailTemplatesDto {
  readonly _id: string;
  readonly title: string;
  readonly action: string;
  readonly subject: string;
  readonly outgoing_mail_server_id: string;
  readonly body: string;
  readonly created_at?: number;
  readonly updated_at?: number;
  readonly updated_by?: string;
  readonly serverName?: ServerName;

  constructor(emailTemplate: EmailTemplatesDto) {
    (this._id = emailTemplate._id),
      (this.title = emailTemplate.title),
      (this.subject = emailTemplate.subject),
      (this.outgoing_mail_server_id = emailTemplate.outgoing_mail_server_id),
      (this.body = emailTemplate.body),
      (this.created_at = emailTemplate.created_at),
      (this.updated_at = emailTemplate.updated_at),
      (this.updated_by = emailTemplate.updated_by),
      (this.serverName = emailTemplate.serverName),
      (this.action = emailTemplate.action);
  }
}

export class ServerName {
  readonly _id: string;
  readonly title: string;

  constructor(server: ServerName) {
    (this._id = server._id), (this.title = server.title);
  }
}
