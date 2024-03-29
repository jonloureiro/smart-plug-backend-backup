import {
  BadRequestError, HttpError, ForbiddenError, NotFoundError,
} from 'restify-errors';
import { Validator } from 'class-validator';
import { ResidenceEntity } from './index';
import { UserEntity } from '../user';


interface Data { code: string; message: string; data: Residence}
interface Residence { id: number; name: string }


const validator = new Validator();

const createResidence = async (name: string, userId?: number): Promise<Data | HttpError> => {
  if (userId === undefined) return new ForbiddenError('Usuário não identificado');

  if (!(validator.minLength(name, 2) && validator.maxLength(name, 50))) {
    return new BadRequestError('Nome inválido');
  }

  const user = await UserEntity.findOne({ id: userId });
  if (user === undefined) return new ForbiddenError('Usuário não identificado');

  const data = await ResidenceEntity.create({ name, users: [user] }).save();

  return {
    code: 'Created',
    message: '',
    data,
  };
};

const listResidence = async (userId?: number): Promise<Data | HttpError> => {
  if (userId === undefined) return new ForbiddenError('Usuário não identificado');

  const user = await UserEntity.findOne(userId, { relations: ['residence'] });

  if (user === undefined) return new ForbiddenError('Usuário não identificado');

  const data = user.residence;

  if (data === undefined) return new NotFoundError('Residência não encontrada');

  return {
    code: 'OK',
    message: '',
    data,
  };
};


export { createResidence, listResidence };
