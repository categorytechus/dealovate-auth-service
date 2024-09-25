import { Expose, Exclude } from 'class-transformer';

export class FeatureResponse {
  @Expose()
  featureId!: number;

  @Expose()
  parentFeatureId!: number;

  @Expose()
  featureName!: string;

  @Expose()
  isParent!: number;

  @Expose()
  title!: string;

  @Expose()
  path!: string;

  @Expose()
  icon!: string;

  @Expose()
  create!: number;

  @Expose()
  read!: number;

  @Expose()
  update!: number;

  @Expose()
  delete!: number;

  @Expose()
  download!: number;

  @Expose()
  selected!: boolean;

  @Expose()
  active!: boolean;
}
