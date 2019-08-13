import { BadRequestError, HttpError, ForbiddenError } from 'restify-errors';
import { Validator } from 'class-validator';
import { UserEntity } from '../user';
import { McuEntity } from '.';


interface Data { code: string; message: string; data: McuEntity}


const validator = new Validator();

const createMcu = async (
  name?: string, mac?: string, userId?: number,
): Promise<Data | HttpError> => {
  if (userId === undefined || name === undefined || mac === undefined) {
    return new ForbiddenError('Corpo da requisição inválido');
  }

  if (!(validator.minLength(name, 2) && validator.maxLength(name, 50))) {
    return new BadRequestError('Nome inválido');
  }

  if (!(validator.minLength(mac, 2) && validator.maxLength(mac, 50))) {
    return new BadRequestError('MAC inválido');
  }

  const user = await UserEntity.findOne({ id: userId });

  if (user === undefined) return new ForbiddenError('Usuário não identificado');

  if (!user.admin) return new ForbiddenError('Usuário não autorizado');

  // if (user.residence === undefined) return new ForbiddenError('Usuário não autorizado');
  // TODO: falha na checagem da residence

  const data = await McuEntity.create({ name, mac, residence: user.residence }).save();

  return {
    code: 'Created',
    message: '',
    data,
  };
};


export { createMcu };
