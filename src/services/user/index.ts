import { Server } from 'restify';
import User from './user.entity';


export { User };

export default (server: Server): void => {
  console.log(server.name);
};
