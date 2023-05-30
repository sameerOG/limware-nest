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

@Entity({ name: 'invoice_print_settings' })
export class InvoicePrintSettings {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column({ default: null })
  logo_image_name!: string;

  @Column()
  laboratory_id!: string;

  @Column({ default: null })
  footer_text!: string;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
