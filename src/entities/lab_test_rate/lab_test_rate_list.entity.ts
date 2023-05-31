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
import { LabTestRateListItem } from './lab_test_rate_list_item.entity';

@Entity({ name: 'lab_test_rate_list' })
export class LabTestRateList {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  name!: string;

  @ManyToOne(() => Facility, (facility) => facility.lab_test_rate)
  @JoinColumn({ name: 'facility_id' })
  facility_id!: Facility;

  @OneToMany(() => LabTestRateListItem, (ltrl) => ltrl.lab_test_rate_list_id)
  lab_test_rate_item!: LabTestRateListItem;

  @Column({ default: null })
  description!: string;

  @ManyToOne(() => Laboratory, (lab) => lab.lab_test_rate)
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
