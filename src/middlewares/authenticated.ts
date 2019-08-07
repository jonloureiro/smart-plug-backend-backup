import {
  Request, Response, Next,
} from 'restify';
import { UnauthorizedError } from 'restify-errors';
import { verify } from 'jsonwebtoken';
import { secret } from '../config';


export = (req: Request, res: Response, next: Next): void => {
  try {
    const token = req.header('cookie').split('=')[1].split(';')[0];
    verify(token, secret);
    next();
  } catch (error) {
    res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/');
    next(new UnauthorizedError('Acesso negado'));
  }
};
