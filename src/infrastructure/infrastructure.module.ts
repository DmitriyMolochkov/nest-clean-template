import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { ConfigModule } from "./config/config.module";
import { ExceptionsModule } from "./exceptions/exceptions.module";
import { HealthCheckModule } from "./healthCheck/healthCheck.module";
import { LoggerModule } from "./logger/logger.module";
import { PackageJsonModule } from "./packageJson/packageJson.module";
import { PostgresModule } from "./postgres/postgres.module";
import { QueueModule } from "./queue/queue.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    LoggerModule,
    PackageJsonModule,
    PostgresModule,
    QueueModule,
    HealthCheckModule,
    ExceptionsModule,
  ],
})
export class InfrastructureModule {}
