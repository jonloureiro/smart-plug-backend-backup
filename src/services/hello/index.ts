import {
  Server, Request, Response, Next,
} from 'restify';


export = (server: Server): void => {
  server.get('/hello/:name', (req: Request, res: Response, next: Next): void => {
    res.send(`hello ${req.params.name}`);
    next();
  });
}
