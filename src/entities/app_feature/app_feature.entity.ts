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

@Entity({ name: 'app_feature' })
export class AppFeature {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  method!: string;

  @Column({ default: null })
  parent_id!: number;

  @Column({ default: null })
  title!: string;

  @Column()
  operation!: string;

  @Column({ default: null })
  description!: string;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
