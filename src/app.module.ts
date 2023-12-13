import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppProcessor } from './app.processor';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

@Module({})
export class AppModule {
  public static async register(): Promise<DynamicModule> {
    return {
      module: AppModule,
      controllers: [AppController],
      providers: [AppProcessor],
      imports: [
        InfrastructureModule,
        BullModule.registerQueue({ name: 'app' }),
        BullBoardModule.forFeature({
          name: 'app',
          adapter: BullMQAdapter,
        }),
      ],
    };
  }
}
