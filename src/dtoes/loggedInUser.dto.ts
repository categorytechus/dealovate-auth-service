import { Expose, Exclude } from 'class-transformer';

export class LoggedInUser {
  @Expose()
  userId!: string;

  @Expose()
  companyId!: string;

  @Expose()
  firstName!: string;

  @Expose()
  lastName!: string;

  @Expose()
  fullName!: string;

  @Expose()
  mobile!: number;

  @Expose()
  emailId!: string;
}
