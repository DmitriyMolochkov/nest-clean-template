import { Inject } from '@nestjs/common';

import { getRedisToken } from './utils';
import { RedisConnectionName } from '../config/dtos/redis-group.config';

export function InjectRedis(connectionName: RedisConnectionName) {
  return Inject(getRedisToken(connectionName));
}
