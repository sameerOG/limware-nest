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
  DeleteDateColumn,
} from 'typeorm';
import { Customers } from '../customer/customer.entity';
import { Facility } from '../Facility/facility.entity';
import { Users } from '../user/user.entity';
import { EmployeeFacility } from './employee_facility.entity';

@Entity({ name: 'employee' })
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  name!: string;

  @OneToOne(() => Users, (user) => user.employee_id)
  @JoinColumn({ name: 'user_id' })
  user_id!: Users;

  @ManyToOne(() => Facility, (facility) => facility.employee_id)
  @JoinColumn({ name: 'facility_id' })
  facility_id!: Facility;

  @Column({ default: null })
  email!: string;

  @Column({ default: null })
  cnic!: string;

  @Column()
  gender!: string;

  @Column()
  mobile_number!: string;

  @Column({ type: 'json', default: null })
  contact_numbers!: string;

  @ManyToOne(() => Customers, (customer) => customer.employee_id)
  @JoinColumn({ name: 'customer_id' })
  customer_id!: Customers;

  @Column()
  address!: string;

  @Column()
  city!: string;

  @Column()
  status!: number;

  @OneToMany(() => EmployeeFacility, (emp_facility) => emp_facility.employee_id)
  emp_facility: EmployeeFacility[];

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;

  @Column()
  @DeleteDateColumn()
  deleted_at!: Date;
}
