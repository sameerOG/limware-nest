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
import { Employee } from '../employee/employee.entity';
import { Facility } from '../Facility/facility.entity';
import { HospitalClinic } from '../hospital_clinic/hospital_clinic.entity';
import { Laboratory } from '../laboratory/laboratory.entity';
import { Users } from '../user/user.entity';

@Entity({ name: 'customer' })
export class Customers {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  name!: string;

  @Column({ default: null })
  email!: string;

  @Column()
  mobile_number!: string;

  @Column({ type: 'json', default: null })
  contact_numbers!: string;

  @OneToOne(() => Users, (user) => user.customer_id)
  user_id!: Users;

  @OneToMany(() => Laboratory, (laboratory) => laboratory.customer_id)
  laboratory_id!: Laboratory;

  @OneToOne(() => HospitalClinic, (laboratory) => laboratory.customer_id)
  clinic!: HospitalClinic;

  @OneToMany(() => Employee, (employee) => employee.customer_id)
  employee_id!: Employee;

  @OneToMany(() => Facility, (facility) => facility.customer_id)
  facility_id!: Facility;

  @Column({ default: null })
  address!: string;

  @Column()
  city!: string;

  @Column({ default: 0 })
  status!: number;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
