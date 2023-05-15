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
import { Appointment } from '../appointment/appointment.entity';
import { UserRole } from '../user_role/user_role.entity';

@Entity({ name: 'reference' })
export class Reference {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  name!: string;

  @Column({ default: null })
  email!: string;

  @Column({ default: null })
  mobile_number!: string;

  @OneToMany(() => Appointment, (app) => app.reference_id)
  appointment: Appointment[];

  @Column()
  facility_id!: string;

  @Column({ default: null })
  address!: string;

  @Column({ default: null })
  city!: string;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
