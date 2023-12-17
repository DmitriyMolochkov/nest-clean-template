import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';

import { BullBoardConfig } from './bull-board.config';
import { HttpConfig } from './http.config';
import { LoggerConfig } from './logger.config';
import { PgConfig } from './pg.config';
import { RedisGroupConfig } from './redis-group.config';

export enum Environment {
  development = 'development',
  production = 'production',
}

export class Config {
  @IsEnum(Environment)
  public readonly configEnv!: Environment;

  @IsDefined()
  @IsString()
  public readonly sessionKey!: string;

  @Type(() => PgConfig)
  @IsDefined()
  @ValidateNested()
  public readonly pg!: PgConfig;

  @Type(() => HttpConfig)
  @IsDefined()
  @ValidateNested()
  public readonly http!: HttpConfig;

  @Type(() => LoggerConfig)
  @IsDefined()
  @ValidateNested()
  public readonly logger!: LoggerConfig;

  @Type(() => RedisGroupConfig)
  @IsDefined()
  @ValidateNested()
  public readonly redisGroups!: RedisGroupConfig;

  @Type(() => BullBoardConfig)
  @IsDefined()
  @ValidateNested()
  public readonly bullBoard!: BullBoardConfig;
}
