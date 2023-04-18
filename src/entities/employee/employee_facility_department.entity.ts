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
  employee_id!: number;

  @Column()
  facility_id!: number;

  @Column()
  employee_facility_id!: number;

  @Column()
  department_id!: number;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
