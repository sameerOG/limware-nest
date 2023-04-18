import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { UserRole } from '../user_role/user_role.entity';

@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  name!: string;

  @Column()
  portal!: string;

  @Column({ type: 'json', default: null })
  permissions!: string;

  @OneToMany(() => UserRole, (user_role) => user_role.role)
  user_roles: UserRole[];

  @Column({ default: 1 })
  status!: number;

  @Column({ default: null })
  system_role!: boolean;

  @Column({ default: null })
  key!: string;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
