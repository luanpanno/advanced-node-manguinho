import { ConnectionOptions } from 'typeorm';

import { env } from '@/main/config/env';

env.db;
export const config: ConnectionOptions = {
  type: 'postgres',
  host: env.db.host,
  port: Number(env.db.port),
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  entities: ['dist/infra/postgres/entities/index.js'],
};
