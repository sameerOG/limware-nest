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
} from 'typeorm';
import { Facility } from '../Facility/facility.entity';
import { Users } from '../user/user.entity';

@Entity({ name: 'user_access_token' })
export class UserAccessToken {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @OneToOne(() => Facility, (facility) => facility.user_token)
  @JoinColumn({ name: 'facility_id' })
  facility_id!: Facility;

  @OneToOne(() => Users, (user) => user.user_token)
  @JoinColumn({ name: 'user_id' })
  user_id!: Users;

  @Column({ default: null })
  access_token!: string;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
