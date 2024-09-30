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

@Entity({ name: 'user_logins' })
export class UserLogin extends BaseEntity {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({ name: 'auth_type', nullable: true })
  authType: string;

  @Column({ name: 'user_name', unique: true })
  userName: string;

  @Column({ name: 'hash_password', nullable: true })
  hashPassword: string;

  @Column({ name: 'access_token', nullable: true })
  accessToken: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Column({
    name: 'token_expire_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  tokenExpireAt: Date;

  @Column({
    name: 'last_login_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  lastLoginAt: Date;

  @Column('jsonb', { name: 'user_claim', nullable: false, default: {} })
  userClaim: any;

  @Column({ name: 'wrong_credential_counter', nullable: false, default: 0 })
  wrongCredentialCounter: number;

  @Column({ name: 'is_blocked', nullable: false, default: 1 })
  isBlocked: number;

  @Column({ name: 'is_active', nullable: false, default: 1 })
  isActive: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @Column({ name: 'created_by', nullable: false })
  createdBy: string;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;
}
