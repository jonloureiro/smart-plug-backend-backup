import { Server } from 'restify';
import routes from './mcu.routes';
import Mcu from './mcu.entity';


export { Mcu as McuEntity };


export default (server: Server): void => {
  routes(server);
};
