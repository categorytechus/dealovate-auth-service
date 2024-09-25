import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'features' })
export class Feature {
  @PrimaryGeneratedColumn({ name: 'feature_id' })
  featureId: number;

  @Column({ name: 'is_parent', nullable: false, default: 0 })
  isParent: number;

  @Column({ name: 'parent_feature_id', nullable: true })
  parentModuleId: number;

  @Column({ name: 'feature_name', nullable: false })
  moduleName: string;

  @Column({ name: 'title', nullable: true })
  title: string;

  @Column({ name: 'path', nullable: true })
  path: string;

  @Column({ name: 'icon', nullable: true })
  icon: string;

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

  @Column({ name: 'selected', nullable: false, default: false })
  selected: boolean;

  @Column({ name: 'active', nullable: false, default: false })
  active: boolean;

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
}
