import { RedisConnectionName } from '../../config/dtos/redisConfigGroup.dto';

export function getRedisToken(connectionName: RedisConnectionName) {
  return Symbol.for(`${connectionName}_RedisClient`);
}
