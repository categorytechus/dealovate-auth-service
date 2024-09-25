import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EmailTemplate } from './emailTemplate.entity';
import { UserOtpLinkVerification } from './userOtpLinkVerification.entity';

@Entity({ name: 'email_notifications' })
export class EmailNotification {
  @Column()
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column('uuid', { name: 'reference_id', nullable: false })
  referenceId: string;

  // @Column('uuid', { name: 'user_id', nullable: false })
  // userId: string;

  @Column('uuid', { name: 'template_id', nullable: true })
  templateId: string;

  @Column({ name: 'email_from', nullable: false })
  emailFrom: string;

  @Column({ name: 'email_to', nullable: false })
  emailTo: string;

  @Column({ name: 'email_cc', nullable: true })
  emailCc: string;

  @Column({ name: 'subject', type: 'varchar', nullable: false })
  subject: string;

  @Column({ name: 'email_body', type: 'varchar', nullable: false })
  emailBody: string;

  @Column({ name: 'schedule_date', type: 'date', nullable: false })
  scheduleDate: Date;

  @Column({ name: 'email_status', type: 'varchar', nullable: false })
  emailStatus: string;

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
  //----------------------------------uncomment this for add foreign key user_otp_link_verification
  @ManyToOne(() => UserOtpLinkVerification, (emailnotif) => emailnotif.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reference_id' })
  reference: UserOtpLinkVerification;
  //----------------------------------uncomment this for add foreign key email template
  @ManyToOne(() => EmailTemplate, (template) => template.emailTemplateId, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'email_template_id' })
  emailTemplate: EmailTemplate;
}
