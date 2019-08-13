import { Server } from 'restify';
import routes from './mcu.routes';
import Mcu from './mcu.entity';
import { McuFactory } from './mcu.utils-spec';


export { Mcu as McuEntity };


export { McuFactory };


export default (server: Server): void => {
  routes(server);
};
