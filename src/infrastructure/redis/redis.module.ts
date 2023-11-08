import { Global, Module } from '@nestjs/common';
import { Redis } from 'ioredis';

import { ConfigDto } from '../config';

@Global()
@Module({
  providers: [
    {
      provide: Redis,
      useFactory: (config: ConfigDto) => new Redis(
        config.redis.port,
        config.redis.host,
        { maxRetriesPerRequest: null },
      ),
      inject: [ConfigDto],
    },
  ],
  exports: [Redis],
})
export class RedisModule {}
