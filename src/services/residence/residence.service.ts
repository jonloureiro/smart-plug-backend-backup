import { BadRequestError, HttpError, ForbiddenError } from 'restify-errors';
import { Validator } from 'class-validator';
import { ResidenceEntity } from './index';
import { UserEntity } from '../user';


interface Data { code: string; message: string; data: Residence}
interface Residence { id: number; name: string }


const validator = new Validator();

const create = async (name: string, userId?: number): Promise<Data | HttpError> => {
  if (userId === undefined) return new ForbiddenError('Usuário não identificado');

  if (!(validator.minLength(name, 2) && validator.maxLength(name, 50))) {
    return new BadRequestError('Nome inválido');
  }

  const admin = await UserEntity.findOne({ id: userId });
  if (admin === undefined) return new ForbiddenError('Usuário não identificado');

  const residence = await ResidenceEntity.create(
    {
      name: name.replace(/(^[\s]+|[\s]+$)/g, ''),
      admin,
    },
  ).save();
  const [residenceName, residenceHash] = residence.name.split('#');
  const data = {
    id: residence.id,
    name: residenceName,
    hash: residenceHash,
  };

  return {
    code: 'Created',
    message: '',
    data,
  };
};


export { create };
