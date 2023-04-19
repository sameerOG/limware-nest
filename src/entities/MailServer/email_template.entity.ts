import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { OutgoingMailServer } from './outgoing_mail_server.entity';

@Entity({ name: 'email_template' })
export class EmailTemplate {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column()
  title: string;

  @ManyToOne(() => OutgoingMailServer, (ms) => ms.email_template_id)
  @JoinColumn({ name: 'outgoing_mail_server_id' })
  outgoing_mail_server_id!: OutgoingMailServer;

  @Column()
  action: string;

  @Column()
  subject: string;

  @Column({ type: 'json' })
  body: string;

  @Column({ default: null })
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
