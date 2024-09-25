import { Expose, Exclude } from 'class-transformer';

export class UserDetailResponse {
  @Expose()
  userId!: string;

  @Expose()
  firstName!: string;

  @Expose()
  lastName!: string;

  @Expose()
  fullName!: string;

  @Expose()
  mobile!: string;

  @Expose()
  email!: string;
}
