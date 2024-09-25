import { Expose, Exclude } from 'class-transformer';

export class ReminderResponse {
  @Expose()
  reminderId!: string;

  @Expose()
  appointmentId!: string;

  @Expose()
  appointmentTitle!: string;

  @Expose()
  userId!: string;

  @Expose()
  userName!: string;

  @Expose()
  emailTemplateId!: string;

  @Expose()
  reminderDate!: string;
}
