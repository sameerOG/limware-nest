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
import { Laboratory } from '../laboratory/laboratory.entity';
import { Patient } from '../patient/patient.entity';
import { PatientTestParameterResult } from '../patient/patient_test_parameter_result.entity';
import { Reference } from '../reference/reference.entity';

@Entity({ name: 'appointment' })
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column({ default: null })
  cc_facility_id!: string;

  @Column()
  facility_id!: string;

  @Column({ default: null })
  patient_account_id!: string;

  @Column()
  type!: number;

  @Column({ default: null })
  laboratory_id!: string;

  @Column({ default: null })
  doctor_id: string;

  @Column({ default: null, unique: true })
  appointment_number!: string;

  @Column({ unique: true, default: null })
  lab_number: string;

  @Column({ default: null })
  reference_number: number;

  @Column()
  appointment_date!: string;

  @Column({ default: null })
  appointment_time: string;

  @Column({ default: null })
  result_delivery_date: string;

  @Column({ default: null })
  result_delivery_time: string;

  @Column({ default: false })
  is_completed: boolean;

  @ManyToOne(() => Patient, (patient) => patient.appointment)
  @JoinColumn({ name: 'patient_id' })
  patient_id!: Patient;

  // @ManyToOne(() => Reference, (reference) => reference.appointment)
  // @JoinColumn({ name: 'reference_id' })
  // reference_id: Reference;

  @Column({ default: null })
  reference_id: string;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
