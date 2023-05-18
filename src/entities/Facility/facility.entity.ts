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
import { Donor } from '../donor/donor.entity';
import { Employee } from '../employee/employee.entity';
import { EmployeeFacility } from '../employee/employee_facility.entity';
import { HospitalClinic } from '../hospital_clinic/hospital_clinic.entity';
import { Laboratory } from '../laboratory/laboratory.entity';
import { LabTestRateList } from '../lab_test_rate/lab_test_rate_list.entity';
import { LabTestRateListItem } from '../lab_test_rate/lab_test_rate_list_item.entity';
import { TestCategory } from '../test/test_category.entity';
import { Users } from '../user/user.entity';
import { UserAccessToken } from '../user_access_token/user_access_token.entity';

@Entity({ name: 'facility' })
export class Facility {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column({ default: null })
  name!: string;

  @OneToOne(() => Facility, (facility) => facility.parent_facility_id)
  @JoinColumn({ name: 'parent_facility_id' })
  parent_facility_id!: Facility;

  @Column({ unique: true, default: null })
  unique_id!: string;

  @OneToMany(() => TestCategory, (tc) => tc.facility_id)
  test_category: TestCategory[];

  @OneToMany(() => Employee, (employee) => employee.facility_id)
  employee_id!: Employee;

  @OneToOne(() => LabTestRateList, (ltrl) => ltrl.facility_id)
  lab_test_rate!: LabTestRateList;

  @OneToOne(() => LabTestRateListItem, (ltrl) => ltrl.facility_id)
  lab_test_rate_item!: LabTestRateListItem;

  @OneToOne(() => HospitalClinic, (clinic) => clinic.facility_id)
  clinic!: HospitalClinic;

  @OneToOne(() => Donor, (donor) => donor.facility_id)
  donor_id!: Donor;

  @OneToMany(() => Laboratory, (laboratory) => laboratory.facility_id)
  laboratory_id!: Laboratory;

  @OneToMany(() => Department, (department) => department.facility_id)
  department_id!: Department;

  @OneToOne(() => UserAccessToken, (user_token) => user_token.facility_id)
  user_token!: UserAccessToken;

  @Column({ default: null })
  email!: string;

  @Column({ default: null })
  mobile_number!: string;

  @Column({ default: null })
  phone_number!: string;

  @Column({ type: 'json', default: null })
  contact_numbers!: string;

  @ManyToOne(() => Customers, (customer) => customer.facility_id)
  @JoinColumn({ name: 'customer_id' })
  customer_id!: Customers;

  @OneToMany(() => Users, (user) => user.facility_id)
  user_id!: Users;

  @Column({ default: null })
  address!: string;

  @Column({ default: null })
  city!: string;

  @Column({ default: null })
  status!: number;

  @Column({ default: null })
  type!: string;

  @Column({ default: null })
  facility_image_name!: string;

  @OneToMany(() => EmployeeFacility, (emp_facility) => emp_facility.facility_id)
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
