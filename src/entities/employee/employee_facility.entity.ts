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
import { Employee } from './employee.entity';

@Entity({ name: 'employee_facility' })
export class EmployeeFacility {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @ManyToOne(() => Employee, (employee) => employee.emp_facility)
  @JoinColumn({ name: 'employee_id' })
  employee_id!: Employee;

  @ManyToOne(() => Facility, (facility) => facility.emp_facility)
  @JoinColumn({ name: 'facility_id' })
  facility_id!: Facility;

  @Column()
  role_ids!: string;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
