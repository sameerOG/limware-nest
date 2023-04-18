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
import { Patient } from './patient.entity';

@Entity({ name: 'patient_account' })
export class PatientAccount {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  parent_facility_id!: number;

  @Column()
  registration_facility_id!: number;

  @Column({ unique: true })
  unique_id!: string;

  @OneToMany(() => Patient, (pat) => pat.patient_account_id)
  patient: Patient[];

  @Column()
  mobile_number!: string;

  @Column({ default: null })
  phone_number!: string;

  @Column()
  other_contacts!: string;

  @Column()
  name!: string;

  @Column()
  gender!: string;

  @Column({ default: null })
  cnic!: string;

  @Column({ default: null })
  email!: string;

  @Column({ default: null })
  dob!: Date;

  @Column({ default: null })
  guardian_info!: string;

  @Column({ default: null })
  address!: string;

  @Column({ default: null })
  city!: string;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
