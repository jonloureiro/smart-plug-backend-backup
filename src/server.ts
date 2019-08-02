import { createServer } from 'restify';

import services, { entitys } from './services';
import database from './database';

import 'reflect-metadata';


const server = createServer({ name: 'SmartPlug' });
services(server);
database(entitys);


export default server;
