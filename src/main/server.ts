import './config/module-alias';

import { createConnection } from 'typeorm';

import { config } from '@/infra/postgres/helpers/config';

import { app } from './config/app';
import { env } from './config/env';

import 'reflect-metadata';

createConnection(config)
  .then(() =>
    app.listen(env.port, () =>
      console.log(`Server running at http://localhost:${env.port}`),
    ),
  )
  .catch(console.error);
