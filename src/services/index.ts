import { Server } from 'restify';

import entitys from './entitys';

import hello from './hello';
import user from './user';
import websocket from './websocket';


export { entitys };

export default (server: Server): void => {
  hello(server);
  user(server);
  websocket(server);
};
