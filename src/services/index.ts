import { Server } from 'restify';
import residence from './residence';
import user from './user';
import websocket from './websocket';
import mcu from './mcu';


export default (server: Server): void => {
  mcu(server);
  residence(server);
  user(server);
  websocket(server);
};
