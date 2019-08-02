import { ConnectionOptions } from 'typeorm';
import { databaseUrl as url, nodeEnv } from '../config';


const config: ConnectionOptions = {
  type: 'postgres',
  url,
  entities: ['dist/**/*.entity.js'],
  synchronize: true,
  logging: false,
  dropSchema: nodeEnv === 'test',
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};


export = config;
