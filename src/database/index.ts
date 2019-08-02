import 'reflect-metadata';
import { createConnection, EntitySchema } from 'typeorm';

import { databaseUrl as url } from '../config';

import { User } from '../services/user';


export = (entities: EntitySchema[]): void => {
  createConnection({
    type: 'postgres',
    url,
    entities,
    synchronize: true,
    logging: false,
  }).then(async (connection): Promise<void> => {
    // teste
    const user = new User();
    user.email = 'me@jonloureiro.dev';
    user.password = '123456';
    user.name = 'Jonathan';

    const userRepository = connection.getRepository(User);
    try {
      await userRepository.save(user);
      console.log('sucesso');
      console.log(user);
    } catch (error) {
      console.log(error.detail);
    }
  }).catch((): void => console.log());
}
