import { Server } from 'restify';

import hello from './hello';
import websocket from './websocket';


export = (server: Server): void => {
  hello(server);
  websocket(server);
};
