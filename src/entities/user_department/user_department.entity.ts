import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Department } from '../department/department.entity';
import { Role } from '../role/role.entity';
import { Users } from '../user/user.entity';

@Entity({name:"user_department"})
export class UserDepartment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  user_id: number;

  @ManyToOne(() => Users, user => user.user_department)
  user: Users;

  @Column()
  department_id: number;

  @ManyToOne(() => Department, role => role.user_department)
  department: Department;
}