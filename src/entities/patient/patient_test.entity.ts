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
import { Test } from '../test/test.entity';
import { PatientAccount } from './patient_account.entity';
import { PatientTestParameterResult } from './patient_test_parameter_result.entity';

@Entity({ name: 'patient_test' })
export class PatientTest {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  facility_id!: number;

  @Column()
  laboratory_id!: number;

  @Column({ default: null })
  patient_account_id!: number;

  @Column()
  patient_id!: number;

  @ManyToOne(() => Test, (test) => test.patient_test)
  @JoinColumn({ name: 'test_id' })
  test_id!: Test;

  @OneToMany(() => PatientTestParameterResult, (ptpr) => ptpr.patient_test_id)
  ptpr: PatientTestParameterResult[];

  @Column()
  appointment_id!: number;

  @Column()
  test_category_id!: number;

  @Column()
  status!: number;

  @Column({ default: null })
  sample_status!: number;

  @Column()
  sample_location!: number;

  @Column({ default: null })
  delete_reason!: string;

  @Column({ default: null })
  user_comment!: string;

  @Column({ default: null })
  is_printed!: number;

  @Column({ default: null })
  donor_id!: number;

  @Column({ default: null })
  notes!: string;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
