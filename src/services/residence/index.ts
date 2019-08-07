import { Server } from 'restify';
import routes from './residence.routes';


export default (server: Server): void => {
  routes(server);
};
