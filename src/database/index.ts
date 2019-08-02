import { createConnection, Connection } from 'typeorm';
import config from './config';


export = async (): Promise<Connection> => createConnection(config);
