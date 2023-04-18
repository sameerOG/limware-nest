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

@Entity({ name: 'lab_test_rate_list_item' })
export class LabTestRateListItem {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  name!: string;

  @Column()
  test_id!: string;

  @OneToOne(() => Facility, (facility) => facility.lab_test_rate_item)
  @JoinColumn({ name: 'facility_id' })
  facility_id!: Facility;

  @Column({ default: null })
  description!: string;

  @OneToOne(() => Laboratory, (lab) => lab.lab_test_rate_item)
  @JoinColumn({ name: 'laboratory_id' })
  laboratory_id!: Laboratory;

  @Column({ type: 'double precision' })
  price!: number;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
