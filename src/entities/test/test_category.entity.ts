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
import { Department } from '../department/department.entity';
import { Facility } from '../Facility/facility.entity';
import { Laboratory } from '../laboratory/laboratory.entity';
import { Test } from './test.entity';

@Entity({ name: 'test_category' })
export class TestCategory {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column({ default: null })
  is_template!: boolean;

  @Column({ default: null })
  ref_code!: string;

  @Column({ default: null })
  parent_category_id!: string;

  @Column({ default: null })
  pl_category_id!: string;

  @OneToMany(() => Test, (test) => test.test_category_id)
  test: Test[];

  @Column()
  name!: string;

  @Column()
  title_for_print!: string;

  @Column()
  type!: string;

  @Column()
  report_template!: string;

  @Column({ default: null })
  description!: string;

  @ManyToOne(() => Facility, (facility) => facility.test_category)
  @JoinColumn({ name: 'facility_id' })
  facility_id!: Facility;

  @ManyToOne(() => Laboratory, (lab) => lab.test_category)
  @JoinColumn({ name: 'laboratory_id' })
  laboratory_id!: Laboratory;

  @ManyToOne(() => Department, (department) => department.test_category)
  @JoinColumn({ name: 'department_id' })
  department_id!: Department;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
