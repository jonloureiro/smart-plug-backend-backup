import { createServer } from 'restify';
import middlewares from './middlewares';
import services from './services';
import 'reflect-metadata';


const server = createServer({ name: 'SmartPlug' });
middlewares(server);
services(server);


export default server;
