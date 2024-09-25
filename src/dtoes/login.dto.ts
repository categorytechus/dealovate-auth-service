import { Expose, Exclude } from 'class-transformer';

export class LoginResponse {
  @Expose()
  userId!: string;

  @Expose()
  userName!: string;

  @Expose()
  firstName!: string;

  @Expose()
  lastName!: string;

  @Expose()
  fullName!: string;

  @Expose()
  userType!: string;

  @Expose()
  mobile: string;

  @Expose()
  email: string;

  @Expose()
  token: string;

  @Expose()
  refreshToken: string;

  @Expose()
  tokenExpiredAt: Date;
}
