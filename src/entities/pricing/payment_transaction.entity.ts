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

@Entity({ name: 'payment_transaction' })
export class PaymentTRansaction {
  @PrimaryGeneratedColumn()
  _id!: number;

  @Column()
  facility_id!: string;

  @Column()
  invoice_id!: string;

  @Column({ default: null })
  transaction_number!: number;

  @Column()
  type!: string;

  @Column()
  payment_method!: string;

  @Column({ default: null })
  user_comment!: string;

  @Column({ type: 'double precision', default: null })
  amount!: number;

  @Column()
  @CreateDateColumn()
  date_created!: Date;

  @Column()
  @UpdateDateColumn()
  date_modified!: Date;
}
