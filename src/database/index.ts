import { createConnection, EntitySchema } from 'typeorm';
import { databaseUrl as url } from '../config';


export = async (entities: EntitySchema[]): Promise<void> => {
  await createConnection({
    type: 'postgres',
    url,
    entities,
    synchronize: true,
    logging: false,
  });
}
