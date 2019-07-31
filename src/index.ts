import server from './server';

import { port } from './config';

require('./components');

server.listen(port);
