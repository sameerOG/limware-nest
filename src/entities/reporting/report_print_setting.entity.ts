import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'report_print_settings' })
export class ReportPrintSetting {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column()
  laboratory_id!: number;

  @Column({ default: null })
  margin_top!: string;

  @Column({ default: null })
  margin_right!: string;

  @Column({ default: null })
  margin_left!: string;

  @Column({ default: null })
  margin_bottom!: string;

  @Column({ default: null })
  header_image_name!: string;

  @Column({ default: null })
  footer_image_name!: string;

  @Column({ default: null })
  header_text!: string;

  @Column({ default: null })
  footer_text!: string;

  @Column({ default: null })
  default_header_type!: string;

  @Column({ default: null })
  default_footer_type!: string;

  @Column({ default: null })
  default_download_header_type!: string;

  @Column({ default: null })
  default_download_footer_type!: string;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
