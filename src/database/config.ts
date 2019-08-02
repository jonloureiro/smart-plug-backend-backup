import { ConnectionOptions } from 'typeorm';
import { databaseUrl as url, nodeEnv } from '../config';

const entities = (nodeEnv === 'test')
  ? ['**/*.entity.ts']
  : ['**/*.entity.js'];

const config: ConnectionOptions = {
  type: 'postgres',
  url,
  entities,
  synchronize: true,
  logging: false,
  dropSchema: nodeEnv === 'test',
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};


export = config;
