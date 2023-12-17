import { Provider } from '@nestjs/common';
import { RedisOptions } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';

import RedisClient from './redis.client';
import { getRedisToken } from './utils';
import { RedisConnectionName, RedisGroupConfig } from '../config/dtos/redis-group.config';

export function createRedisProviders(
  optionsArray: (RedisOptions & { connectionName: RedisConnectionName })[],
): Provider[] {
  return (optionsArray || []).map(({ connectionName, ...options }) => ({
    provide: getRedisToken(connectionName),
    useFactory: async (
      redisConfigGroup: RedisGroupConfig,
      logger: PinoLogger,
    ) => {
      const redisConfig = redisConfigGroup[connectionName];
      const redis = new RedisClient(
        connectionName,
        {
          lazyConnect: true,
          ...options,
          host: redisConfig.host,
          port: redisConfig.port,
        },
        logger,
      );

      await redis.connect();

      return redis;
    },
    inject: [RedisGroupConfig, PinoLogger],
  }));
}
