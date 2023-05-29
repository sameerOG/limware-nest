import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { InvoiceLineItem } from './invoice_line_item.entity';

@Entity({ name: 'invoice' })
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  facility_id!: string;

  @Column({ default: null })
  patient_account_id!: string;

  @Column()
  patient_id!: string;

  @Column()
  appointment_id!: string;

  @OneToMany(() => InvoiceLineItem, (ili) => ili.invoice_id)
  invoice_line_item: InvoiceLineItem[];

  @Column({ default: null })
  invoice_number!: number;

  @Column()
  status!: number;

  @Column()
  title!: string;

  @Column()
  invoice_date!: string;

  @Column({ default: null })
  description!: string;

  @Column({ type: 'double precision' })
  total_amount!: number;

  @Column({ default: null, type: 'double precision' })
  discount_amount!: number;

  @Column({ type: 'double precision' })
  total_payable_amount!: number;

  @Column({ default: null, type: 'double precision' })
  paid_amount!: number;

  @Column({ default: null, type: 'double precision' })
  due_amount!: number;

  @Column({ default: null })
  user_comments!: string;

  @Column({ default: null })
  activity_log!: string;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
