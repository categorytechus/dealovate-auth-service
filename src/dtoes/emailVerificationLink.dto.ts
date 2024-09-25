import { Expose, Exclude } from 'class-transformer';

export class EmailVerificationLinkResponse {
  @Expose()
  emailVerificationLink!: string;
}
