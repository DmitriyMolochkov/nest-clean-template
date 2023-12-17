import { Module, OnApplicationShutdown } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { RedisConnectionName } from './config';
import { ConfigModule } from './config/config.module';
import { ExceptionsModule } from './exceptions/exceptions.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { LoggerModule } from './logger/logger.module';
import { PackageJsonModule } from './package-json/package-json.module';
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
