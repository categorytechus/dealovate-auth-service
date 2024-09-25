import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Country } from './country.entity';

@Entity({ name: 'timezones' })
export class Timezone extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'country_code', nullable: false })
  countryCode: string;

  @Column({ name: 'time_zone', unique: true, nullable: false })
  timeZone: string;

  @Column({ name: 'utc_offset', nullable: false })
  utc_offset: string;

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

  @ManyToOne(() => Country, (country) => country.countryCode, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'country_code' })
  country: Country;
}
