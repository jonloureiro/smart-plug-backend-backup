import { Server } from 'restify';
import routes from './user.routes';
import User from './user.entity';


export { User as UserEntity };

export default (server: Server): void => {
  routes(server);
};
