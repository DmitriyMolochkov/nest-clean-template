import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';

import { BullBoardConfigDto } from './bullBoardConfig.dto';
import { HttpConfigDto } from './httpConfig.dto';
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
