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

@Entity({ name: 'laboratory_setting' })
export class LaboratorySetting {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column({ default: null })
  facility_id!: string;

  @Column()
  laboratory_id!: string;

  @Column()
  require_results_for_mark_as_done!: boolean;

  @Column()
  print_empty_result!: boolean;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
