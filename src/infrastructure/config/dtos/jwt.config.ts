import { IsDefined, IsString } from 'class-validator';

export class JwtConfig {
  @IsDefined()
  @IsString()
  public readonly access_secret!: string;

  @IsDefined()
  @IsString()
  public readonly refresh_secret!: string;

  @IsDefined()
  @IsString()
  public readonly access_ttl!: string;

  @IsDefined()
  @IsString()
  public readonly refresh_ttl!: string;
}
