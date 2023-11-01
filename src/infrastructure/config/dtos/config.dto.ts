import { Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';

import { BullBoardConfigDto } from './bullBoardConfig.dto';
import { HttpConfigDto } from './httpConfig.dto';
import { JobsConfigDto } from './jobsConfig.dto';
import { LoggerConfigDto } from './loggerConfig.dto';
import { PgConfigDto } from './pgConfig.dto';
import { RedisConfigDto } from './redisConfig.dto';

export class ConfigDto {
  @IsString()
  public readonly configEnv!: string;

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

  @Type(() => RedisConfigDto)
  @IsDefined()
  @ValidateNested()
  public readonly redis!: RedisConfigDto;

  @Type(() => JobsConfigDto)
  @IsDefined()
  @ValidateNested()
  public readonly jobs!: JobsConfigDto;

  @Type(() => BullBoardConfigDto)
  @IsDefined()
  @ValidateNested()
  public readonly bullBoard!: BullBoardConfigDto;
}
