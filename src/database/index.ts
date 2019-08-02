import { createConnection } from 'typeorm';
import { databaseUrl as url } from '../config';


export = async (): Promise<void> => {
  await createConnection({
    type: 'postgres',
    url,
    entities: ['dist/**/*.entity.js'],
    synchronize: true,
    logging: false,
  });
}
