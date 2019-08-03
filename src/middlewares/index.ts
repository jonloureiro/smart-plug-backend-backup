import { Server, plugins } from 'restify';

export default (server: Server): void => {
  server.use(plugins.bodyParser());
};
