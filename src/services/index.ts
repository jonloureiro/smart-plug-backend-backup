import { Server } from 'restify';
import hello from './hello';
import user from './user';
import websocket from './websocket';


export default (server: Server): void => {
  hello(server);
  user(server);
  websocket(server);
};
