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
import { Test } from '../test/test.entity';

@Entity({ name: 'uom' })
export class UOM {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  name!: string;

  @Column({ default: null })
  description!: string;

  @OneToMany(() => Test, (test) => test.uom_id)
  test: Test[];

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
