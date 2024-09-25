import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Feature } from './feature.entity';

@Entity({ name: 'role_feature_permissions' })
@Unique(['roleId', 'featureId'])
export class RoleFeaturePermission extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'role_id', nullable: false })
  roleId: number;

  @Column({ name: 'feature_id', nullable: false })
  featureId: number;

  @Column({ name: 'create', nullable: false, default: 0 })
  create: number;

  @Column({ name: 'read', nullable: false, default: 0 })
  read: number;

  @Column({ name: 'update', nullable: false, default: 0 })
  update: number;

  @Column({ name: 'delete', nullable: false, default: 0 })
  delete: number;

  @Column({ name: 'download', nullable: false, default: 0 })
  download: number;

  @Column({ name: 'is_active', nullable: false, default: 1 })
  isActive: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by', nullable: false })
  createdBy: string;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;

  @ManyToOne(() => Role, (role) => role.roleId)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Feature, (feature) => feature.featureId)
  @JoinColumn({ name: 'feature_id' })
  feature: Feature;
}
