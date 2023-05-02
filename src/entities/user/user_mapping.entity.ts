import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Laboratory } from '../laboratory/laboratory.entity';
import { Users } from './user.entity';

@Entity({ name: 'user_mapping' })
export class UserMapping {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  @ManyToOne(() => Users, (user) => user.user_mapping)
  @JoinColumn({ name: 'user_id' })
  user_id!: number;

  @Column()
  facility_id!: number;

  @Column({ default: null })
  role_ids!: string;

  @ManyToOne(() => Laboratory, (lab) => lab.user_mapping)
  @JoinColumn({ name: 'laboratory_id' })
  laboratory_id!: Laboratory;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
