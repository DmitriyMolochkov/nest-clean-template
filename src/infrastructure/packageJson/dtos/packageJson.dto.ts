import { Expose } from 'class-transformer';

export class PackageJsonDto {
  @Expose()
  public readonly name!: string;

  @Expose()
  public readonly version!: string;

  @Expose()
  public readonly description!: string;
}
