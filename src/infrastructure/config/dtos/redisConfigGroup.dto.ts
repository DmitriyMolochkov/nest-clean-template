import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';

import { RedisConfigDto } from './redisConfig.dto';

export enum RedisConnectionName {
  default = 'default',
}

export class RedisConfigGroupDto implements Record<RedisConnectionName, RedisConfigDto> {
  @Type(() => RedisConfigDto)
  @IsDefined()
  @ValidateNested()
  public readonly default!: RedisConfigDto;
}
