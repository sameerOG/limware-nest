import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { Customers } from '../customer/customer.entity';
import { Department } from '../department/department.entity';
import { Donor } from '../donor/donor.entity';
import { Facility } from '../Facility/facility.entity';
import { InvoicePrintSettings } from '../invoice/invoice_print_settings.entity';
import { LabTestRateList } from '../lab_test_rate/lab_test_rate_list.entity';
import { LabTestRateListItem } from '../lab_test_rate/lab_test_rate_list_item.entity';
import { Test } from '../test/test.entity';
import { TestCategory } from '../test/test_category.entity';
import { TestGroup } from '../test/test_group.entity';
import { TestParameter } from '../test/test_parameter.entity';
import { UserMapping } from '../user/user_mapping.entity';

@Entity({ name: 'laboratory' })
export class Laboratory {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  name!: string;

  @Column({ default: null })
  logo_file!: string;

  @Column()
  type!: string;

  @Column()
  mobile_number!: string;

  @Column({ unique: true, default: null })
  unique_id!: string;

  @Column({ type: 'json', default: null })
  contact_numbers!: string;

  @OneToMany(() => TestCategory, (tc) => tc.laboratory_id)
  test_category: TestCategory[];

  @OneToMany(() => Test, (test) => test.laboratory_id)
  test: Test[];

  @OneToMany(() => TestParameter, (tp) => tp.laboratory_id)
  test_parameter: TestParameter[];

  @OneToMany(() => TestGroup, (tg) => tg.laboratory_id)
  test_group: TestGroup[];

  @OneToOne(() => Laboratory, (laboratory) => laboratory.parent_lab_id)
  @JoinColumn({ name: 'parent_lab_id' })
  parent_lab_id!: Laboratory;

  @OneToOne(() => LabTestRateList, (ltrl) => ltrl.laboratory_id)
  lab_test_rate!: LabTestRateList;

  @OneToMany(() => UserMapping, (um) => um.laboratory_id)
  user_mapping!: UserMapping;

  @OneToOne(() => LabTestRateListItem, (ltrl) => ltrl.laboratory_id)
  lab_test_rate_item!: LabTestRateListItem;

  @ManyToOne(() => Facility, (facility) => facility.laboratory_id)
  @JoinColumn({ name: 'facility_id' })
  facility_id!: Facility;

  @ManyToOne(() => Customers, (customer) => customer.laboratory_id)
  @JoinColumn({ name: 'customer_id' })
  customer_id!: Customers;

  @OneToOne(() => Department, (department) => department.parent_id)
  department_id!: Department;

  @OneToOne(() => InvoicePrintSettings, (iv) => iv.laboratory_id)
  invoice_print_setting!: InvoicePrintSettings;

  @OneToOne(() => Donor, (donor) => donor.laboratory_id)
  donor_id!: Donor;

  @Column({ default: null })
  status!: number;

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
