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
import { Test } from '../test/test.entity';

@Entity({ name: 'specimen' })
export class specimen {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  name!: string;

  @Column({ default: null })
  description!: string;

  @OneToMany(() => Test, (test) => test.specimen_id)
  test: Test[];

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
