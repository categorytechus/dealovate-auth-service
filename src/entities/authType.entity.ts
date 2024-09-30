import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserLogin } from './userLogin.entity';

@Entity({ name: 'auth_types' })
export class AuthType extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'type_id' })
  typeId: number;

  @Column({ name: 'type_name', unique: true, nullable: false })
  typeName: string;

  @Column({ name: 'type_desc', nullable: true })
  typeDesc: string;

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

  @OneToMany(() => UserLogin, (login) => login.authType, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  logins: UserLogin[];
}
