import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'facility_sms_setting' })
export class FacilitySmsSetting {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column({ default: null })
  employee_id!: number;

  @Column({ default: null })
  facility_id!: number;

  @Column({ default: null })
  registration_sms!: string;

  @Column({ default: null })
  registration_sms_status!: boolean;

  @Column({ default: null })
  payment_done_sms!: string;

  @Column({ default: null })
  payment_done_sms_status!: boolean;

  @Column({ default: null })
  reports_done_sms!: string;

  @Column({ default: null })
  reports_done_sms_status!: boolean;

  @Column({ default: null })
  reports_done_and_payment_pending_sms!: string;

  @Column({ default: null })
  reports_done_and_payment_pending_sms_status!: boolean;

  @Column({ default: null })
  registration_whatsapp!: string;

  @Column({ default: null })
  registration_whatsapp_status!: boolean;

  @Column({ default: null })
  payment_done_whatsapp!: string;

  @Column({ default: null })
  payment_done_whatsapp_status!: boolean;

  @Column({ default: null })
  reports_done_whatsapp!: string;

  @Column({ default: null })
  reports_done_whatsapp_status!: boolean;

  @Column({ default: null })
  reports_done_and_payment_pending_whatsapp!: string;

  @Column({ default: null })
  reports_done_and_payment_pending_whatsapp_status!: boolean;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
