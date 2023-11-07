import { Options } from 'pino-http';

declare interface ProcessEnv extends Dict<string> {
  // common
  CONFIG_ENV: string;
  SECRET_KEY: string;

  // postgres
  PG_WRITE_CONNECTION_STRING: string;
  PG_READ_CONNECTION_STRING: string;
  PG_CONNECTION_TIMEOUT: string | undefined;
  PG_POOL_SIZE: string | undefined;

  // http
  HTTP_PORT: string | undefined;
  HTTP_HOST: string | undefined;
  SWAGGER_SERVER: string | undefined;
  HTTP_DEFAULT_CLIENT_TIMEOUT: string | undefined;

  // bull-board
  BULL_BOARD_USERNAME: string | undefined;
  BULL_BOARD_PASSWORD: string | undefined;

  // logger
  LOG_LEVEL: Options['useLevel'];

  // redis
  REDIS_HOST: string | undefined;
  REDIS_PORT: string | undefined;

  // jobs
  DEACTIVATED_JOBS: string | undefined;

  // typeorm
  TYPEORM_MIGRATIONS_TRANSACTION_MODE: 'all' | 'each' | undefined;
}
