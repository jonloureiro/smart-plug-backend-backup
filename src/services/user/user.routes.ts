import {
  Server, Request, Response, Next,
} from 'restify';
import { login } from './user.service';

export default (server: Server): void => {
  server.post('/auth/login', async (req: Request, res: Response, next: Next): Promise<void> => {
    const { email, password } = req.body;
    const token = await login(email, password);
    res.send(token);
    next();
  });

  server.post('/auth/register', (req: Request, res: Response, next: Next): void => {
    res.statusCode = 201;
    res.send();
    next();
  });
};
