import {
  Server, Request, Response, Next,
} from 'restify';
import { authenticated } from '../../middlewares';

export default (server: Server): void => {
  server.get('/residences',
    authenticated,
    async (req: Request, res: Response, next: Next): Promise<void> => {
      res.send();
      next();
    });
};
