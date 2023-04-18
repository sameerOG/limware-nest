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
import { TestParameter } from '../test/test_parameter.entity';
import { PatientAccount } from './patient_account.entity';
import { PatientTest } from './patient_test.entity';

@Entity({ name: 'patient_test_parameter_result' })
export class PatientTestParameterResult {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  facility_id!: number;

  @Column()
  laboratory_id!: number;

  @Column({ default: null })
  result!: string;

  @Column()
  widal_result!: string;

  @ManyToOne(() => Test, (test) => test.ptpr)
  @JoinColumn({ name: 'test_id' })
  test_id!: Test;

  @ManyToOne(() => PatientTest, (pt) => pt.ptpr)
  @JoinColumn({ name: 'patient_test_id' })
  patient_test_id!: PatientTest;

  @ManyToOne(() => TestParameter, (tp) => tp.ptpr)
  @JoinColumn({ name: 'test_parameter_id' })
  test_parameter_id!: TestParameter;

  @Column({ default: false })
  is_abnormal!: boolean;

  @Column()
  normal_ranges_ids!: string;

  @Column()
  status!: number;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
