import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'email_templates' })
export class EmailTemplate {
  @Column()
  @PrimaryGeneratedColumn('uuid', { name: 'email_template_id' })
  emailTemplateId: string;

  @Column({ name: 'type_id', type: 'integer', nullable: false })
  typeId: number;

  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string;

  @Column({ name: 'subject', type: 'varchar', nullable: false })
  subject: string;

  @Column({ name: 'body', type: 'varchar', nullable: false })
  body: string;

  @Column({ name: 'is_active', type: 'integer', nullable: false, default: 1 })
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
