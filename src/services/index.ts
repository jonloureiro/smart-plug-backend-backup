import { Server } from 'restify';
import user from './user';
import websocket from './websocket';


export default (server: Server): void => {
  user(server);
  websocket(server);
};
