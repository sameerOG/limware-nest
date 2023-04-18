import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Customers } from '../customer/customer.entity';
import { Facility } from '../Facility/facility.entity';
import { Laboratory } from '../laboratory/laboratory.entity';

@Entity({ name: 'lab_test_rate_list' })
export class LabTestRateList {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  name!: string;

  @OneToOne(() => Facility, (facility) => facility.lab_test_rate)
  @JoinColumn({ name: 'facility_id' })
  facility_id!: Facility;

  @Column({ default: null })
  description!: string;

  @OneToOne(() => Laboratory, (lab) => lab.lab_test_rate)
  @JoinColumn({ name: 'laboratory_id' })
  laboratory_id!: Laboratory;

  @Column()
  status!: number;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
