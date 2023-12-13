import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BullBoardAuthMiddleware, BullBoardAuthModule } from './auth';
import { RedisConnectionName } from '../config/dtos/redisConfigGroup.dto';
import { PackageJsonDto } from '../packageJson';
import RedisClient from '../redis/redis.client';
import { getRedisToken } from '../redis/utils';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [
        getRedisToken(RedisConnectionName.default),
        PackageJsonDto,
      ],
      useFactory: (redis: RedisClient, packageJson: PackageJsonDto) => {
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
