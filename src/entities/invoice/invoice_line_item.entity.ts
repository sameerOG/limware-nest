import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity({ name: 'invoice_line_item' })
export class InvoiceLineItem {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  facility_id!: string;

  @Column({ default: null })
  test_id!: string;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoice_line_item)
  @JoinColumn({ name: 'invoice_id' })
  invoice_id!: Invoice;

  @Column()
  title!: string;

  @Column({ type: 'double precision' })
  amount!: number;

  @Column({ default: null })
  remarks!: string;

  @Column({ default: null })
  delete_reason!: string;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
