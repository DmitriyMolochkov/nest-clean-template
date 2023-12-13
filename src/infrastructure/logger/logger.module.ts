import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import pino from 'pino';

import { ConfigDto, Environment } from '../config';
import { PackageJsonDto } from '../packageJson';

const pinoConfigsObj: Record<Environment, pino.LoggerOptions> = {
  development: {
    transport: {
      target: 'pino-pretty',
    },
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  production: {},
};

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [ConfigDto, PackageJsonDto],
      useFactory: (config: ConfigDto, packageJson: PackageJsonDto) => ({
        pinoHttp: {
          ...pinoConfigsObj[config.configEnv],
          name: packageJson.name,
          level: config.logger.level,
        },
        forRoutes: ['api'],
      }),
    }),
  ],
})
export class LoggerModule {}
