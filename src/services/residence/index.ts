import { Server } from 'restify';
import routes from './residence.routes';
import Residence from './residence.entity';


export { Residence as ResidenceEntity };

export default (server: Server): void => {
  routes(server);
};
