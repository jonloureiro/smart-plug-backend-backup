import {
  Server, Response, Next,
} from 'restify';
import { authenticated, RequestAuthenticated } from '../../middlewares';
import { createMcu } from './mcu.service';


export default (server: Server): void => {
  server.post('/mcus',
    authenticated,
    async (req: RequestAuthenticated, res: Response, next: Next): Promise<void> => {
      const { name, mac } = req.body || { name: undefined, mac: undefined };
      const { userId } = req;
      const data = await createMcu(name, mac, userId);
      if (data.code === 'Created') res.statusCode = 201;
      res.send(data);
      next();
    });
};
