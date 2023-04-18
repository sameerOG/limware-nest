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
import { TestParameter } from './test_parameter.entity';

@Entity({ name: 'test_group' })
export class TestGroup {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column({ default: null })
  is_template!: boolean;

  @Column({ default: false })
  archived!: boolean;

  @Column({ default: null })
  pl_group_id!: number;

  @Column()
  name!: string;

  @Column({ default: null })
  facility_id!: number;

  @Column()
  parent!: string;

  @Column()
  parent_id!: number;

  @Column({ default: null })
  sequence!: number;

  @Column({ default: null })
  description!: string;

  @ManyToOne(() => Laboratory, (lab) => lab.test_group)
  @JoinColumn({ name: 'laboratory_id' })
  laboratory_id!: Laboratory;

  @OneToMany(() => TestParameter, (tp) => tp.test_group_id)
  test_parameter: TestParameter[];

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
