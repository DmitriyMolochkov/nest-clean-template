import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  migrationsTransactionMode: process.env.TYPEORM_MIGRATIONS_TRANSACTION_MODE ?? 'each',
  logger: 'advanced-console',
  url: process.env.PG_WRITE_CONNECTION_STRING,
  connectTimeoutMS: Number(process.env.PG_CONNECTION_TIMEOUT ?? '60000'),
  entities: [],
});
