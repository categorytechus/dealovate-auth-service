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

@Entity({ name: 'tenants' })
export class Tenant {
  @Column()
  @PrimaryGeneratedColumn('uuid', { name: 'tenant_id' })
  tenantId: string;

  @Column({ name: 'tenant_name', nullable: false })
  tenantName: string;

  @Column({ name: 'email_id', nullable: false })
  emailId: string;

  @Column({ name: 'is_email_verified', nullable: false, default: 0 })
  isEmailVerified: number;

  @Column({ name: 'phone_no', nullable: false })
  phoneNo: string;

  @Column({ name: 'is_phone_verfied', nullable: false, default: 0 })
  isPhoneVerfied: number;

  @Column({ name: 'website', nullable: true })
  website: string;

  @Column({ name: 'app_url', nullable: true })
  appUrl: string;

  @Column({ name: 'tnc_url', nullable: true })
  tncUrl: string;

  @Column({ name: 'logo_sm', nullable: true })
  logoSm: string;

  @Column({ name: 'logo_lg', nullable: true })
  logoLg: string;

  @Column({ name: 'address_id', nullable: true })
  addressId: number;

  @Column({ name: 'language', nullable: true })
  language: string;

  @Column({ name: 'currency', nullable: true })
  currency: string;

  @Column({ name: 'timezone', nullable: true })
  timezone: number;

  @Column({ name: 'profile_picture', nullable: true })
  profilePicture: string;

  @Column('jsonb', { name: 'other_info', nullable: true, default: {} })
  otherInfo: any;

  @Column({ name: 'is_active', nullable: false, default: 1 })
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




// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';

// @Entity({ name: 'tenants' })
// export class Tenant {
//   @PrimaryGeneratedColumn('uuid', { name: 'tenant_id' })
//   tenantId: string;

//   @Column({ name: 'support_email', nullable: true })
//   supportEmail: string;

//   @Column({ name: 'support_phone', nullable: true })
//   supportPhone: string;

//   @Column({ name: 'app_url', nullable: true })
//   appUrl: string;

//   @Column({ name: 'logo_lg_document_id', nullable: true })
//   logo: string;

//   @Column({ name: 'created_by', nullable: true })
//   createdBy: string;

//   @Column({ name: 'is_deleted', nullable: false, default: 1 })
//   isActive: number;

//   @CreateDateColumn({ name: 'created_at' })
//   createdAt: Date;

//   @Column({ name: 'updated_by', nullable: true })
//   updatedBy: string;

//   @UpdateDateColumn({ name: 'updated_at' })
//   updatedAt: Date;
// }
