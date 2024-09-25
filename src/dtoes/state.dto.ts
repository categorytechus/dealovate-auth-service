import { Expose, Exclude } from 'class-transformer';
import { UUID } from 'crypto';

export class StateResponse {
  @Expose()
  id!: number;

  @Expose()
  countryCode!: string;

  @Expose()
  stateCode!: string;

  @Expose()
  stateName!: string;
}
