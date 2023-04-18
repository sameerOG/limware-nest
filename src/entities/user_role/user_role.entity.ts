import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Role } from '../role/role.entity';
import { Users } from '../user/user.entity';

@Entity('user_role')
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => Users, (user) => user.user_roles)
  user: Users;

  @Column()
  role_id: string;

  @ManyToOne(() => Role, (role) => role.user_roles)
  role: Role;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
