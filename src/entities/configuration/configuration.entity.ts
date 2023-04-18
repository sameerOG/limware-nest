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
import { ConfigurationOption } from './configuration_option.entity';

@Entity({ name: 'configuration' })
export class Configuration {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  conf_key!: string;

  @Column()
  conf_value!: string;

  @Column()
  title!: string;

  @Column()
  is_single!: boolean;

  @Column({ default: null })
  type!: string;

  @Column({ default: null })
  description!: string;

  @Column({ default: null })
  facility_id!: number;

  @Column({ default: null })
  lab_id!: number;

  @Column({ default: null })
  hc_id!: number;

  @OneToMany(() => ConfigurationOption, (conf) => conf.configuration_id)
  conf_id: ConfigurationOption[];

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
