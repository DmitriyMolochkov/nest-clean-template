import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';

import { BullBoardConfigDto } from './bullBoardConfig.dto';
import { HttpConfigDto } from './httpConfig.dto';
import { JWTConfigDto } from './jwtConfig.dto';
import { LdapConfigDto } from './ldapConfig.dto';
import { LoggerConfigDto } from './loggerConfig.dto';
import { PgConfigDto } from './pgConfig.dto';
import { RedisConfigGroupDto } from './redisConfigGroup.dto';

export enum Environment {
  development = 'development',
  production = 'production',
}

export class ConfigDto {
  @IsEnum(Environment)
  public readonly configEnv!: Environment;

  @IsDefined()
  @IsString()
  public readonly sessionKey!: string;

  @Type(() => JWTConfigDto)
  @IsDefined()
  @ValidateNested()
  public readonly jwt!: JWTConfigDto;

  @Type(() => LdapConfigDto)
  @IsDefined()
  @ValidateNested()
  public readonly ldap!: LdapConfigDto;

  @Type(() => PgConfigDto)
  @IsDefined()
  @ValidateNested()
  public readonly pg!: PgConfigDto;

  @Type(() => HttpConfigDto)
  @IsDefined()
  @ValidateNested()
  public readonly http!: HttpConfigDto;

  @Type(() => LoggerConfigDto)
  @IsDefined()
  @ValidateNested()
  public readonly logger!: LoggerConfigDto;

  @Type(() => RedisConfigGroupDto)
  @IsDefined()
  @ValidateNested()
  public readonly redisGroups!: RedisConfigGroupDto;

  @Type(() => BullBoardConfigDto)
  @IsDefined()
  @ValidateNested()
  public readonly bullBoard!: BullBoardConfigDto;
}
