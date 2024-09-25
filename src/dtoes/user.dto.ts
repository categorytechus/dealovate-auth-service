import { Expose, Exclude } from 'class-transformer';

export class UserResponse {
  @Expose()
  userId!: string;

  @Expose()
  firstName!: string;

  @Expose()
  lastName!: string;

  @Expose()
  fullName!: string;

  @Expose()
  roles!: string;

  @Expose()
  emailId!: string;

  @Expose()
  mobile!: string;

  @Exclude()
  password!: string;
}
