import {
  Server, Request, Response, Next,
} from 'restify';


export default (server: Server): void => {
  server.post('/auth/login', (req: Request, res: Response, next: Next): void => {
    res.send();
    next();
  });

  server.post('/auth/register', (req: Request, res: Response, next: Next): void => {
    res.statusCode = 201;
    res.send();
    next();
  });
};
