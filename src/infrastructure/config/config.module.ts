import { DynamicModule, Module } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { ConfigDto } from './dtos';
import { RedisConfigGroupDto } from './dtos/redisConfigGroup.dto';
import { plainConfig } from './plainConfig';

@Module({})
export class ConfigModule {
  public static forRoot(): DynamicModule {
    return {
      module: ConfigModule,
      global: true,
      providers: [
        {
          provide: ConfigDto,
          useFactory: () => ConfigModule.configFactory(),
        },
        {
          provide: RedisConfigGroupDto,
          useFactory: (config: ConfigDto) => config.redisGroups,
          inject: [ConfigDto],
        },
      ],
      exports: [ConfigDto, RedisConfigGroupDto],
    };
  }

  private static async configFactory(): Promise<ConfigDto> {
    const config = await ConfigModule.loadConfig();
    await ConfigModule.validateConfig(config);

    return config;
  }

  private static async loadConfig(): Promise<ConfigDto> {
    return plainToInstance(ConfigDto, plainConfig);
  }

  private static async validateConfig(config: ConfigDto): Promise<void> {
    const errors = await validate(config, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      throw new Error(errors.map((x) => x.toString()).join('\n'));
    }
  }
}
