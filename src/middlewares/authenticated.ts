import {
  Request, Response, Next,
} from 'restify';
import { UnauthorizedError } from 'restify-errors';
import { verify } from 'jsonwebtoken';
import { secret } from '../config';

export interface RequestAuthenticated extends Request {
  userId?: number;
}

interface Decoded { id: number }

const authenticated = (req: RequestAuthenticated, res: Response, next: Next): void => {
  try {
    const token = req.header('cookie').split('=')[1].split(';')[0];
    const { id } = verify(token, secret) as Decoded;
    req.userId = id;
    next();
  } catch (error) {
    res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/');
    next(new UnauthorizedError('Acesso negado'));
  }
};

export default authenticated;
