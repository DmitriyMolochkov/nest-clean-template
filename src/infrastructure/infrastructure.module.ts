import { Module, OnApplicationShutdown } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { ConfigModule } from './config/config.module';
import { RedisConnectionName } from './config/dtos/redisConfigGroup.dto';
import { ExceptionsModule } from './exceptions/exceptions.module';
import { HealthCheckModule } from './healthCheck/healthCheck.module';
import { LoggerModule } from './logger/logger.module';
import { PackageJsonModule } from './packageJson/packageJson.module';
import { PostgresModule } from './postgres/postgres.module';
import { QueueModule } from './queue/queue.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule,
    PackageJsonModule,
    PostgresModule,
    QueueModule,
    RedisModule.forRoot([
      {
        connectionName: RedisConnectionName.default,
        maxRetriesPerRequest: null,
      },
    ]),
    HealthCheckModule,
    ExceptionsModule,
  ],
})
export class InfrastructureModule implements OnApplicationShutdown {
  public constructor(
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public onApplicationShutdown(signal?: string): void {
    this.logger.info(`Received shutdown signal: ${signal}`);
  }
}
