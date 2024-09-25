import { Expose, Exclude } from 'class-transformer';

export class PasswordRestLinkResponse {
  @Expose()
  passwordResetLink!: string;
}
