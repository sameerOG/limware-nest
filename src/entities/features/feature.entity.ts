import { Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'feature' })
export class Feature {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column({default:null})
  title: string;

  @Column()
  content: string;

  @Column({default:null})
  is_published: boolean;

  @Column()
  @CreateDateColumn()
  date_created!: Date;

  @Column()
  @UpdateDateColumn()
  date_modified!: Date;
}
