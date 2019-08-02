import { Server } from 'restify';
import routes from './user.routes';


export default (server: Server): void => {
  routes(server);
};
