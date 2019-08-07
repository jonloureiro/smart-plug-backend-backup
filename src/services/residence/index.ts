import { Server } from 'restify';
import routes from './residence.routes';
import Residence from './residence.entity';
import { ResidenceFactory, ResidenceName } from './residence.utils-spec';


export { Residence as ResidenceEntity };

export { ResidenceFactory, ResidenceName };

export default (server: Server): void => {
  routes(server);
};
