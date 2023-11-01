import { ExpressAdapter } from "@bull-board/express";
import { BullBoardModule } from "@bull-board/nestjs";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";

import { BullBoardAuthMiddleware, BullBoardAuthModule } from "./auth";
import { ConfigDto } from "../config";

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigDto],
      useFactory: (config: ConfigDto) => ({
        connection: {
          host: config.redis.host,
          port: config.redis.port,
        },
      }),
    }),
    BullBoardModule.forRoot({
      route: "/bull/queues",
      adapter: ExpressAdapter,
      middleware: BullBoardAuthMiddleware,
    }),
    BullBoardAuthModule,
  ],
})
export class QueueModule {}
