import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { EmailTemplate } from './email_template.entity';

@Entity({ name: 'outgoing_mail_server' })
export class OutgoingMailServer {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column()
  title: string;

  @Column({ default: false })
  is_default: boolean;

  @Column()
  host: string;

  @OneToMany(() => EmailTemplate, (email) => email.outgoing_mail_server_id)
  email_template_id!: EmailTemplate;

  @Column()
  port: number;

  @Column()
  encryption: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;

  @Column()
  @DeleteDateColumn()
  deleted_at!: Date;
}
