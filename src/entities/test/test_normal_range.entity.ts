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
import { Test } from './test.entity';

@Entity({ name: 'test_normal_range' })
export class TestNormalRange {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column({ default: null })
  pl_tnr_id!: number;

  @Column()
  normal_range_for!: string;

  @Column({ default: null })
  pl_group_id!: number;

  @Column({ default: null })
  condition!: string;

  @Column({ default: null })
  min_op!: string;

  @Column({ default: null })
  min_value!: number;

  @Column({ default: false })
  archieved: boolean;

  @Column({ default: null })
  max_op!: string;

  @Column({ default: null })
  max_value!: number;

  @Column({ default: null })
  sequence!: number;

  @Column({ default: null })
  parent_record_id!: number;

  @Column({ default: false })
  archived!: boolean;

  @ManyToOne(() => Test, (test) => test.test_normal_range)
  @JoinColumn({ name: 'test_id' })
  test_id!: Test;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
