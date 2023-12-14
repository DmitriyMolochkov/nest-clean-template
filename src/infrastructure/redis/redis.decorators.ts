import { Inject } from '@nestjs/common';

import { getRedisToken } from './utils';
import { RedisConnectionName } from '../config/dtos/redisConfigGroup.dto';

export function InjectRedis(connectionName: RedisConnectionName) {
  return Inject(getRedisToken(connectionName));
}
