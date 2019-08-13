import {
  Server, Response, Next,
} from 'restify';
import { authenticated, RequestAuthenticated } from '../../middlewares';
import { createResidence, listResidence } from './residence.service';

export default (server: Server): void => {
  server.post('/residences',
    authenticated,
    async (req: RequestAuthenticated, res: Response, next: Next): Promise<void> => {
      const { name } = req.body || { name: '' };
      const { userId } = req;
      const data = await createResidence(name, userId);
      if (data.code === 'Created') res.statusCode = 201;
      res.send(data);
      next();
    });

  server.get('/residences',
    authenticated,
    async (req: RequestAuthenticated, res: Response, next: Next): Promise<void> => {
      const { userId } = req;
      const data = await listResidence(userId);
      if (data.code === 'OK') res.statusCode = 200;
      res.send(data);
      next();
    });
};
