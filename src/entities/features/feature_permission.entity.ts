import { Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'feature_permission' })
export class FeaturePermission {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column()
  name: string;

  @Column()
  @CreateDateColumn()
  date_created!: Date;

  @Column()
  @UpdateDateColumn()
  date_modified!: Date;
}
