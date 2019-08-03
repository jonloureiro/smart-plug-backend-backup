import { Server, plugins } from 'restify';
import authenticated from './authenticated';


export { authenticated };

export default (server: Server): void => {
  server.use(plugins.bodyParser());
};
