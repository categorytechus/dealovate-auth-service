import { BaseEntity, Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'password_resets' })
export class PasswordReset extends BaseEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({ name: 'reset_token', nullable: false })
  resetToken: string;

  @Column({ name: 'created_by', nullable: false })
  createdBy: string;

  @Column({ name: 'updated_by' })
  updatedBy: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @Column({
    name: 'expire_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  expireAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  updatedAt: Date;

  @Column({ name: 'is_used', nullable: false, default: 0 })
  isUsed: number;

  @Column({ name: 'is_active', nullable: false, default: 1 })
  isActive: number;
}
