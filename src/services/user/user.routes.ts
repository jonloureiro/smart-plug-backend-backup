import {
  Server, Request, Response, Next,
} from 'restify';
import { login, register } from './user.service';
import { authenticated } from '../../middlewares';

export default (server: Server): void => {
  server.post('/auth/login', async (req: Request, res: Response, next: Next): Promise<void> => {
    const { email, password } = req.body;
    const token = await login(email, password);
    if (typeof token === 'string') {
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly`);
      res.send();
    } else {
      res.send(token);
    }
    next();
  });

  server.post('/auth/register', async (req: Request, res: Response, next: Next): Promise<void> => {
    const { name, email, password } = req.body;
    const token = await register(name, email, password);
    if (typeof token === 'string') {
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly`);
      res.statusCode = 201;
      res.send();
    } else {
      res.send(token);
    }
    next();
  });

  server.get('/auth/private',
    authenticated,
    async (req: Request, res: Response, next: Next): Promise<void> => {
      res.send();
      next();
    });
};
