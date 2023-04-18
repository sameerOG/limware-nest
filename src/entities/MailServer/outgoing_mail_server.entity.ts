import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { EmailTemplate } from './email_template.entity';

@Entity({ name: 'outgoing_mail_server' })
export class OutgoingMailServer {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column()
  title: string;

  @Column({ default: false })
  is_default: boolean;

  @Column()
  host: string;

  @OneToOne(() => EmailTemplate, email => email.outgoing_mail_server_id)
  email_template_id!: EmailTemplate;

  @Column()
  port: number;

  @Column()
  encryption: string;

  @Column()
  username: string;

  @Column()
  password: string;
}
