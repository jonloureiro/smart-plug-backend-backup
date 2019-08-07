import { Server } from 'restify';
import routes from './residence.routes';
import Residence from './residence.entity';
import { ResidenceFactory } from './residence.utils-spec';


export { Residence as ResidenceEntity };

export { ResidenceFactory };

export default (server: Server): void => {
  routes(server);
};
