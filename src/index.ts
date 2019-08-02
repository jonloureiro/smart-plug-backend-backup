/* eslint-disable no-console */

import { createConnection } from 'typeorm';
import { config } from './database';
import server from './server';
import { port } from './config';


createConnection(config)
  .then((): void => {
    server.listen(port, (): void => console.log(`${server.name} on ${server.url}`));
  })
  .catch((error): void => console.log(`Erro no database\n${error}`));
