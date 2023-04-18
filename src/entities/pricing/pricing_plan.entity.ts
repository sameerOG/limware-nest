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

@Entity({ name: 'pricing_plan' })
export class PricingPlan {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  name!: string;

  @Column()
  title!: string;

  @Column()
  is_published!: boolean;

  @Column()
  plan_for!: string;

  @Column()
  plan_type!: string;

  @Column()
  packages!: string;

  @Column({ default: null })
  trial_days!: number;

  @Column({ type: 'double precision', default: null })
  unit_price!: number;

  @Column({ type: 'double precision', default: null })
  discount!: number;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
