import { Expose, Exclude } from 'class-transformer';
import { UUID } from 'crypto';

export class CountryResponse {
  @Expose()
  id!: number;

  @Expose()
  countryCode!: string;

  @Expose()
  countryName!: string;
}
