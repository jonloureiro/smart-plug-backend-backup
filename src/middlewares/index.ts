import { Server, plugins } from 'restify';
import authenticated, { RequestAuthenticated } from './authenticated';


export { authenticated, RequestAuthenticated };

export default (server: Server): void => {
  server.use(plugins.bodyParser());
};
