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
import { Department } from '../department/department.entity';
import { Employee } from '../employee/employee.entity';
import { Facility } from '../Facility/facility.entity';
import { UserAccessToken } from '../user_access_token/user_access_token.entity';
import { UserDepartment } from '../user_department/user_department.entity';
import { UserRole } from '../user_role/user_role.entity';
import { UserMapping } from './user_mapping.entity';

@Entity({ name: 'user' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column({ default: 0 })
  isSuperUser!: number;

  @Column()
  portal!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ default: null })
  feature_id!: number;

  @OneToOne(() => Employee, (employee) => employee.user_id)
  employee_id!: Employee;

  @OneToOne(() => Department, (department) => department.hod_id)
  department_id!: Department;

  @OneToOne(() => UserAccessToken, (user_token) => user_token.user_id)
  user_token!: UserAccessToken;

  @OneToMany(() => UserRole, (user_role) => user_role.user)
  user_roles: UserRole[];

  @OneToMany(() => UserDepartment, (user_department) => user_department.user)
  user_department: UserDepartment[];

  @OneToMany(() => UserMapping, (user_mapping) => user_mapping.user_id)
  user_mapping: UserMapping[];

  @Column({ type: 'json', default: null })
  contact_numbers!: string;

  @ManyToOne(() => Customers, (customer) => customer.user_id, {
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'customer_id' })
  customer_id!: Customers;

  @ManyToOne(() => Facility, (facility) => facility.user_id)
  @JoinColumn({ name: 'facility_id' })
  facility_id!: Facility;

  @Column({ unique: true, default: null })
  email!: string;

  @Column({ unique: true })
  mobile_number!: string;

  @Column()
  password_hash!: string;

  @Column({ unique: true, default: null })
  password_reset_token!: string;

  @Column()
  password!: string;

  @Column()
  full_name!: string;

  @Column({ default: null })
  profile_image_name!: string;

  @Column({ default: null })
  address!: string;

  @Column({ default: null })
  city!: string;

  @Column({ default: null })
  auth_key!: string;

  @Column({ default: 0 })
  status!: number;

  @Column({ default: null })
  otp!: string;

  @Column({ default: null })
  password_reset_pin!: number;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
