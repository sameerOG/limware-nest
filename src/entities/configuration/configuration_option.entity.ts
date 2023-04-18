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
import { Configuration } from './configuration.entity';

@Entity({ name: 'configuration_option' })
export class ConfigurationOption {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  conf_key!: string;

  @Column()
  conf_value!: string;

  @Column()
  title!: string;

  @ManyToOne(() => Configuration, (facility) => facility.conf_id)
  @JoinColumn({ name: 'configuration_id' })
  configuration_id!: Configuration;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
