import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Facility } from '../Facility/facility.entity';
import { Laboratory } from '../laboratory/laboratory.entity';
import { Users } from '../user/user.entity';

@Entity({ name: 'donor' })
export class Donor {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  name!: string;

  @Column({ default: null })
  blood_group!: string;

  @Column()
  age!: number;

  @Column()
  unique_id!: number;

  @Column()
  age_unit!: string;

  @Column()
  gender!: string;

  @Column({ default: null })
  address!: string;

  @Column({ default: null })
  city!: string;

  @OneToOne(() => Facility, (facility) => facility.donor_id)
  @JoinColumn({ name: 'facility_id' })
  facility_id!: Facility;

  @OneToOne(() => Laboratory, (lab) => lab.donor_id)
  @JoinColumn({ name: 'laboratory_id' })
  laboratory_id!: Laboratory;

  @Column()
  mobile_number!: string;

  @Column()
  registration_date!: Date;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
