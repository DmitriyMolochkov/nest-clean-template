import { DynamicModule, Module } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { Config, RedisGroupConfig } from './dtos';
import { plainConfig } from './plain-config';

@Module({})
export class ConfigModule {
  public static forRoot(): DynamicModule {
    return {
      module: ConfigModule,
      global: true,
      providers: [
        {
          provide: Config,
          useFactory: () => ConfigModule.configFactory(),
        },
        {
          provide: RedisGroupConfig,
          useFactory: (config: Config) => config.redisGroups,
          inject: [Config],
        },
      ],
      exports: [Config, RedisGroupConfig],
    };
  }

  private static async configFactory(): Promise<Config> {
    const config = await ConfigModule.loadConfig();
    await ConfigModule.validateConfig(config);

    return config;
  }

  private static async loadConfig(): Promise<Config> {
    return plainToInstance(Config, plainConfig);
  }

  private static async validateConfig(config: Config): Promise<void> {
    const errors = await validate(config, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      throw new Error(errors.map((x) => x.toString()).join('\n'));
    }
  }
}
