import { Expose, Exclude } from 'class-transformer';

export class AppointmentResponse {
  @Expose()
  appointmentId!: string;

  @Expose()
  typeId!: number;

  @Expose()
  typeName!: string;

  @Expose()
  title!: string;

  @Expose()
  startDate!: string;

  @Expose()
  endDate!: string;

  @Expose()
  startTime!: string;

  @Expose()
  endTime!: string;

  @Expose()
  location!: string;

  @Expose()
  statusId!: number;

  @Expose()
  statusName!: string;

  @Expose()
  hostId!: string;

  @Expose()
  hostName!: string;

  @Expose()
  description!: string;

  @Expose()
  userType!: string;
}
