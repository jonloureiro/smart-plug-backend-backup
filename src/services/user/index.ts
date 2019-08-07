import { Server } from 'restify';
import routes from './user.routes';
import User from './user.entity';
import { UserFactory } from './user.utils-spec';


export { User as UserEntity };

export { UserFactory };

export default (server: Server): void => {
  routes(server);
};
