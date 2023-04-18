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

@Entity({ name: 'addons' })
export class Addons {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  facility_id!: number;

  @Column({ type: 'json', default: null })
  sms!: string;

  @Column({ type: 'json', default: null })
  whatsapp!: string;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
