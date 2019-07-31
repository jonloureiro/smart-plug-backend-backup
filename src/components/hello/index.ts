import { Request, Response, Next } from 'restify';

import server from '../../server';

server.get('/hello/:name', (req: Request, res: Response, next: Next): void => {
  res.send(`hello ${req.params.name}`);
  next();
});
