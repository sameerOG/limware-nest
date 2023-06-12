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
import { PatientTestParameterResult } from '../patient/patient_test_parameter_result.entity';
import { Test } from './test.entity';
import { TestGroup } from './test_group.entity';

@Entity({ name: 'test_parameter' })
export class TestParameter {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column({ default: null })
  facility_id!: string;

  @Column({ default: null })
  pl_tp_id!: number;

  @Column({ default: null })
  sequence!: number;

  @Column({ default: false })
  archived!: boolean;

  @ManyToOne(() => Test, (test) => test.test_parameter_parent)
  @JoinColumn({ name: 'parent_test_id' })
  parent_test_id!: Test;

  @OneToMany(() => PatientTestParameterResult, (ptpr) => ptpr.test_parameter_id)
  ptpr: PatientTestParameterResult[];

  @ManyToOne(() => Test, (test) => test.test_parameter_child)
  @JoinColumn({ name: 'child_test_id' })
  child_test_id!: Test;

  @ManyToOne(() => Laboratory, (lab) => lab.test_parameter)
  @JoinColumn({ name: 'laboratory_id' })
  laboratory_id!: Laboratory;

  @ManyToOne(() => TestGroup, (tg) => tg.test_parameter)
  @JoinColumn({ name: 'test_group_id' })
  test_group_id!: TestGroup;

  @Column({ default: false })
  archieved: boolean;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
