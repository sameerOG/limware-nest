import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'employee_facility_department' })
export class EmployeeFacilityDepartment {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  employee_id!: string;

  @Column()
  facility_id!: string;

  @Column()
  employee_facility_id!: string;

  @Column()
  department_id!: string;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
