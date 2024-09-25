import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'user_otp_link_verifications' })
export class UserOtpLinkVerification extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column({ name: 'verification_type', nullable: false })
  verificationType: string;

  @Column({ name: 'verification_code', nullable: false })
  verificationCode: string;

  @Column({
    name: 'expired_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  expiredAt: Date;

  @Column({ name: 'is_consumed', nullable: false, default: 0 })
  isConsumed: number;

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
