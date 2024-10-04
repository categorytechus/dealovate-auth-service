import {
  Entity,
  PrimaryGeneratedColumn,
  Generated,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({ name: 'first_name', nullable: false })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ name: 'email_id', nullable: false })
  emailId: string;

  @Column({ name: 'is_email_verified', nullable: false })
  isEmailVerified: number;

  @Column({ name: 'phone_number', nullable: true })
  mobile: string;

  @Column({ name: 'is_mobile_verified', nullable: false })
  isMobileVerfied: number;

  // @Column({ name: 'alternate_mobile', nullable: true })
  // alternateMobile: string;

  @Column({ name: 'gender', nullable: true })
  gender: string;

  @Column({ name: 'nationality', nullable: true })
  nationality: string;

  @Column({ name: 'language', nullable: true })
  language: string;

  @Column({ name: 'currency', nullable: true })
  currency: string;

  @Column({ name: 'timezone', nullable: true })
  timezone: number;

  @Column({
    name: 'dob',
    type: 'timestamp',
    nullable: true,
  })
  dob: string;

  // @Column({ name: 'profile_picture', nullable: true })
  // profilePicture: string;

  @Column('jsonb', { name: 'other_info', nullable: true, default: {} })
  otherInfo: any;

  @Column({ name: 'is_deleted', nullable: false, default: 1 })
  isActive: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;
}
