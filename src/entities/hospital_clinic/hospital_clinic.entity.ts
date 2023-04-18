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
import { Users } from '../user/user.entity';

@Entity({ name: 'hospital_clinic' })
export class HospitalClinic {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  name!: string;

  @OneToOne(() => Facility, (facility) => facility.clinic)
  @JoinColumn({ name: 'facility_id' })
  facility_id!: Facility;

  @Column({ default: null })
  logo_file!: string;

  @Column({ default: null })
  email!: string;

  @Column({ default: null })
  state!: string;

  @Column({ type: 'json' })
  contact_numbers!: string;

  @OneToOne(() => Customers, (customer) => customer.clinic)
  @JoinColumn({ name: 'customer_id' })
  customer_id!: Customers;

  @Column()
  address!: string;

  @Column({ default: null })
  city!: string;

  @Column({ default: null })
  status!: number;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
