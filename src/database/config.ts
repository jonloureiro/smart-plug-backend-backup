import { ConnectionOptions } from 'typeorm';
import { databaseUrl as url } from '../config';

const config: ConnectionOptions = {
  type: 'postgres',
  url,
  entities: ['dist/**/*.entity.js'],
  synchronize: true,
  logging: false,
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};

export = config;
