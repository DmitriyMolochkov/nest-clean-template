import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BullBoardAuthMiddleware, BullBoardAuthModule } from './auth';
import { RedisConnectionName } from '../config';
import { PackageJson } from '../package-json';
import RedisClient from '../redis/redis.client';
import { getRedisToken } from '../redis/utils';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [
        getRedisToken(RedisConnectionName.default),
        PackageJson,
      ],
      useFactory: (redis: RedisClient, packageJson: PackageJson) => {
        return ({
          connection: redis,
          prefix: `${packageJson.name}:job-queue`,
        });
      },
    }),
    BullBoardModule.forRoot({
      route: '/bull/queues',
      adapter: ExpressAdapter,
      middleware: BullBoardAuthMiddleware,
    }),
    BullBoardAuthModule,
  ],
})
export class QueueModule {}
