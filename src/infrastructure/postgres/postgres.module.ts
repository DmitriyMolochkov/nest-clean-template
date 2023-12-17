import path from 'path';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Config } from 'infrastructure/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [Config],
      useFactory: (config: Config) => ({
        type: 'postgres',
        entities: [path.join(__dirname, '..', '..', '**', 'entities', '*.entity{.ts,.js}')],
        logging: 'all',
        logger: 'debug',
        extra: {
          max: config.pg.poolSize,
        },
        replication: {
          master: {
            url: config.pg.writeConnectionString,
          },
          slaves: [
            {
              url: config.pg.readConnectionString,
            },
          ],
        },
        connectTimeoutMS: config.pg.connectionTimeout,
      }),
    }),
  ],
})
export class PostgresModule {}
