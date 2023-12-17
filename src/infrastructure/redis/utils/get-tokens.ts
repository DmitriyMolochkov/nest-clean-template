import { RedisConnectionName } from '../../config/dtos/redis-group.config';

export function getRedisToken(connectionName: RedisConnectionName) {
  return Symbol.for(`${connectionName}_RedisClient`);
}
