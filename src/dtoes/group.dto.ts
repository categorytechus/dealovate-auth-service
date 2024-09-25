import { Expose, Exclude } from 'class-transformer';

export class GroupResponse {
  @Expose()
  groupId!: number;

  @Expose()
  groupName!: string;

  @Expose()
  groupDesc!: string;
}
