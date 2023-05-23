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
import { Laboratory } from '../laboratory/laboratory.entity';
import { PatientTest } from '../patient/patient_test.entity';
import { PatientTestParameterResult } from '../patient/patient_test_parameter_result.entity';
import { specimen } from '../specimen/specimen.entity';
import { UOM } from '../uom/uom.entity';
import { TestCategory } from './test_category.entity';
import { TestNormalRange } from './test_normal_range.entity';
import { TestParameter } from './test_parameter.entity';

@Entity({ name: 'test' })
export class Test {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column({ default: null })
  is_template!: boolean;

  @Column({ default: null })
  ref_code!: string;

  @Column({ default: null })
  template_test_id!: number;

  @Column({ default: null })
  pl_test_id!: number;

  @OneToMany(() => TestNormalRange, (tnr) => tnr.test_id)
  test_normal_range: TestNormalRange[];

  @OneToMany(() => PatientTestParameterResult, (ptpr) => ptpr.test_id)
  ptpr: PatientTestParameterResult[];

  @OneToMany(() => PatientTest, (pt) => pt.test_id)
  patient_test: PatientTest[];

  @OneToMany(() => TestParameter, (tp) => tp.parent_test_id)
  test_parameter_parent: TestParameter[];

  @OneToMany(() => TestParameter, (tp) => tp.child_test_id)
  test_parameter_child: TestParameter[];

  @Column({ default: null })
  facility_id!: number;

  @Column({ default: null })
  code!: number;

  @Column()
  name!: string;

  @Column()
  title_for_print!: string;

  @Column({ default: null, type: 'json' })
  sample_quantity!: string;

  @Column({ default: null })
  res_input_type!: string;

  @Column({ default: null })
  decimal_length!: number;

  @Column({ default: null })
  res_input_options!: string;

  @Column({ default: null })
  description!: string;

  @Column({ default: null })
  default_notes!: string;

  @Column({ default: null, type: 'json' })
  duration!: string;

  @Column()
  single_or_group!: string;

  @Column({ default: 1 })
  status!: number;

  @Column({ default: null })
  sequence!: number;

  @Column({ default: false })
  print_or_seperate_page!: boolean;

  @Column({ default: null })
  report_template!: number;

  @Column({ default: null })
  tags!: string;

  @Column({ default: false })
  parametric_only!: boolean;

  @Column({ default: false })
  archived!: boolean;

  @Column({ default: null })
  parent_test_id!: string;

  @Column({ default: null })
  default_result!: string;

  @Column({ default: null })
  report_template_name!: string;

  @ManyToOne(() => Laboratory, (lab) => lab.test)
  @JoinColumn({ name: 'laboratory_id' })
  laboratory_id!: Laboratory;

  @ManyToOne(() => TestCategory, (tc) => tc.test)
  @JoinColumn({ name: 'test_category_id' })
  test_category_id!: TestCategory;

  @ManyToOne(() => UOM, (uom) => uom.test)
  @JoinColumn({ name: 'uom_id' })
  uom_id!: UOM;

  @ManyToOne(() => specimen, (spec) => spec.test)
  @JoinColumn({ name: 'specimen_id' })
  specimen_id!: specimen;

  @ManyToOne(() => Department, (department) => department.test)
  @JoinColumn({ name: 'department_id' })
  department_id!: Department;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
