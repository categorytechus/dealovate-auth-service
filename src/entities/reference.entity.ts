import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'references' })
@Unique('unique_reference_constraint', ['referenceType', 'referenceValue'])
export class Gender extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'reference_id' })
  genderId: number;

  @Column({ name: 'reference_type', nullable: false })
  referenceType: string;

  @Column({ name: 'reference_value', nullable: false })
  referenceValue: string;

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
