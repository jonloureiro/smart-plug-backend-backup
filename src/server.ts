import { createServer } from 'restify';
import services from './services';
import 'reflect-metadata';


const server = createServer({ name: 'SmartPlug' });
services(server);


export default server;
