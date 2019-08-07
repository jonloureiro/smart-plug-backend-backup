import { Server } from 'restify';
import residence from './residence';
import user from './user';
import websocket from './websocket';


export default (server: Server): void => {
  residence(server);
  user(server);
  websocket(server);
};
