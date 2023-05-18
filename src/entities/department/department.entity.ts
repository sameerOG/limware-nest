import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Facility } from '../Facility/facility.entity';
import { Laboratory } from '../laboratory/laboratory.entity';
import { Test } from '../test/test.entity';
import { TestCategory } from '../test/test_category.entity';
import { Users } from '../user/user.entity';
import { UserDepartment } from '../user_department/user_department.entity';

@Entity({ name: 'department' })
export class Department {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  name!: string;

  @Column({ default: null })
  description!: string;

  @ManyToOne(() => Facility, (facility) => facility.department_id)
  @JoinColumn({ name: 'facility_id' })
  facility_id!: Facility;

  @OneToMany(() => Test, (test) => test.department_id)
  test: Test[];

  @Column({ default: null })
  pf_department_id!: number;

  @OneToMany(
    () => UserDepartment,
    (user_department) => user_department.department,
  )
  user_department: UserDepartment[];

  @OneToMany(() => TestCategory, (tc) => tc.department_id)
  test_category: TestCategory[];

  @OneToOne(() => Users, (user) => user.department_id)
  @JoinColumn({ name: 'hod_id' })
  hod_id!: Users;

  @ManyToOne(() => Laboratory, (lab) => lab.department_id)
  @JoinColumn({ name: 'parent_id' })
  parent_id!: Laboratory;

  @Column()
  parent!: string;

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
