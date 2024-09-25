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

@Entity({ name: 'tenant_users' })
@Unique('unique_tenant_user_constraint', ['tenantId', 'userId'])
export class TenantUser {
  @Column()
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column('uuid', { name: 'tenant_id', nullable: false })
  tenantId: string;

  @Column('uuid', { name: 'user_id', nullable: true })
  userId: string;

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
