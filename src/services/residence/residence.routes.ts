import {
  Server, Request, Response, Next,
} from 'restify';
import { authenticated, RequestAuthenticated } from '../../middlewares';
import { create } from './residence.service';

export default (server: Server): void => {
  server.post('/residences',
    authenticated,
    async (req: RequestAuthenticated, res: Response, next: Next): Promise<void> => {
      const { name } = req.body || { name: '' };
      const { userId } = req;
      const data = await create(name, userId);
      if (data.code === 'Created') res.statusCode = 201;
      res.send(data);
      next();
    });

  server.get('/residences',
    authenticated,
    async (req: Request, res: Response, next: Next): Promise<void> => {
      res.send();
      next();
    });
};
