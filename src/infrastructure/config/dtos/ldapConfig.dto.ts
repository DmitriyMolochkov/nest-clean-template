import { IsDefined, IsString } from 'class-validator';

export class LdapConfigDto {
  @IsDefined()
  @IsString()
  public readonly url!: string;

  @IsDefined()
  @IsString()
  public readonly login!: string;

  @IsDefined()
  @IsString()
  public readonly password!: string;

  @IsDefined()
  @IsString()
  public readonly dc!: string;
}
