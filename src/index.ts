/* eslint-disable no-console */

import database from './database';
import server from './server';
import { entitys } from './services';
import { port } from './config';


database(entitys)
  .then((): void => {
    server.listen(port, (): void => console.log(`${server.name} on ${server.url}`));
  })
  .catch((error): void => console.log(`Erro no database\n${error.error}`));
