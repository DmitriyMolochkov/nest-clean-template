import { ConfigDto, LogLevel } from './dtos';

export const plainConfig: ConfigDto = {
  configEnv: process.env.CONFIG_ENV,
  sessionKey: process.env.SESSION_SECRET_KEY,
  jwt: {
    access_secret: process.env.ACCESS_TOKEN_SECRET_KEY,
    refresh_secret: process.env.REFRESH_TOKEN_SECRET_KEY,
    access_ttl: process.env.ACCESS_TOKEN_TTL ?? '300s',
    refresh_ttl: process.env.REFRESH_TOKEN_TTL ?? '7d',
  },
  ldap: {
    url: process.env.LDAP_URL,
    login: process.env.LDAP_LOGIN,
    password: process.env.LDAP_PASSWORD,
    dc: process.env.LDAP_DC,
  },
  pg: {
    writeConnectionString: process.env.PG_WRITE_CONNECTION_STRING,
    readConnectionString: process.env.PG_READ_CONNECTION_STRING,
    connectionTimeout: Number(process.env.PG_CONNECTION_TIMEOUT ?? '60000'),
    poolSize: Number(process.env.PG_POOL_SIZE ?? '10'),
  },
  http: {
    port: Number(process.env.HTTP_PORT ?? '8080'),
    host: process.env.HTTP_HOST ?? '0.0.0.0',
    swaggerServer: process.env.SWAGGER_SERVER ?? '/',
    defaultClientTimeout: Number(process.env.HTTP_DEFAULT_CLIENT_TIMEOUT ?? '60000'),
  },
  bullBoard: {
    username: process.env.BULL_BOARD_USERNAME ?? 'bull',
    password: process.env.BULL_BOARD_PASSWORD ?? 'bull',
  },
  logger: {
    level: (process.env.LOG_LEVEL ?? LogLevel.info) as LogLevel,
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? '6379'),
  },
  jobs: {
    deactivatedJobs: (process.env.DEACTIVATED_JOBS ?? '').split(','),
  },
};
