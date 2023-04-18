import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Appointment } from '../appointment/appointment.entity';
import { PatientAccount } from './patient_account.entity';

@Entity({ name: 'patient' })
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  facility_id!: number;

  @Column({ default: null })
  registration_date!: number;

  @Column({ unique: true, default: null })
  unique_id!: string;

  @OneToMany(() => Appointment, (app) => app.patient_id)
  appointment: Appointment[];

  @Column({ default: null })
  cc_facility_id!: number;

  @ManyToOne(() => PatientAccount, (pa) => pa.patient)
  @JoinColumn({ name: 'patient_account_id' })
  patient_account_id!: PatientAccount;

  @Column({ default: null })
  mobile_number!: string;

  @Column({ default: null })
  phone_number!: string;

  @Column({ default: null })
  other_contacts!: string;

  @Column()
  name!: string;

  @Column()
  age!: number;

  @Column()
  age_unit!: string;

  @Column()
  gender!: string;

  @Column({ default: null })
  cnic!: string;

  @Column({ default: null })
  email!: string;

  @Column({ default: null })
  dob!: string;

  @Column({ default: null })
  guardian_info!: string;

  @Column({ default: null })
  address!: string;

  @Column({ default: null })
  city!: string;

  @Column({ default: null })
  referred_by_self!: number;

  @Column({ default: null })
  referred_by!: string;

  @Column({ type: 'json', default: null })
  notification_statuses!: string;

  @Column({ type: 'json', default: null })
  appointment_info!: string;

  @Column({ default: null })
  created_by_name!: string;

  @Column({ default: null })
  rep_pin!: string;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
