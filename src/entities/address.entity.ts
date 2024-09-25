import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../entities/user.entity';

@Entity({ name: 'addresses' })
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'address_id' })
  addressId: number;

  @Column({ name: 'country', nullable: false })
  country: number;

  @Column({ name: 'state', nullable: false })
  state: number;

  @Column({ name: 'city', nullable: true })
  city: string;

  @Column({ name: 'zipcode', nullable: false })
  zipcode: string;

  @Column({ name: 'address_1', nullable: false })
  address1: string;

  @Column({ name: 'address_2', nullable: true })
  address2: string;

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
