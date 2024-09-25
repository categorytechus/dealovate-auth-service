import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'roles' })
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'role_name', nullable: false })
  roleName: string;

  @Column({ name: 'role_desc', nullable: true })
  roleDesc: string;

  @Column('jsonb', { name: 'role_claim', nullable: false, default: {} })
  roleClaim: any;

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

  @OneToMany(() => User, (user) => user.userId, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  users: User[];
}
