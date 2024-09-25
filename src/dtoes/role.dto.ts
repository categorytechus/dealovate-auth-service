import { Expose, Exclude } from 'class-transformer';

export class RoleResponse {
  @Expose()
  roleId!: number;

  @Expose()
  roleName!: string;

  @Expose()
  roleDesc!: string;
}
