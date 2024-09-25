import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Address } from './address.entity';
import { User } from './user.entity';

@Unique('unique_user_address_constraint', ['userId', 'addressId'])
@Entity({ name: 'user_addresses' })
export class UserRole extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @Column({ name: 'address_id', nullable: false })
  addressId: number;

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

  //   @ManyToOne(() => User, (user) => user.userId, {
  //     onUpdate: 'CASCADE',
  //     onDelete: 'CASCADE',
  //   })
  //   @JoinColumn({ name: 'user_id' })
  //   users: User[];

  //   @ManyToOne(() => Address, (address) => address.addressId, {
  //     onUpdate: 'CASCADE',
  //     onDelete: 'CASCADE',
  //   })
  //   @JoinColumn({ name: 'address_id' })
  //   addresses: Address[];
}
