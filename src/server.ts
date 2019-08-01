import { createServer } from 'restify';

import services from './services';


const server = createServer();
services(server);


export default server;
