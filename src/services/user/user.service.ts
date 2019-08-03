import { BadRequestError, HttpError } from 'restify-errors';
import { Validator } from 'class-validator';
import User from './user.entity';


const validator = new Validator();

const login = async (email: string, password: string): Promise<string | HttpError> => {
  if (!validator.isEmail(email)) {
    return new BadRequestError('E-mail inválida');
  }

  if (!(validator.minLength(password, 6) && validator.maxLength(password, 255))) {
    return new BadRequestError('Senha inválida');
  }

  const user = await User.findOne({ email });

  if (user === undefined) {
    return new BadRequestError('E-mail não cadastrado');
  }

  if (!await user.checkPassword(password)) {
    return new BadRequestError('E-mail e/ou senha estão errados');
  }

  return user.generateToken();
};

const register = async (
  name: string, email: string, password: string,
): Promise<string | HttpError> => {
  if (!validator.isEmail(email)) {
    return new BadRequestError('E-mail inválida');
  }

  if (!(validator.minLength(password, 6) && validator.maxLength(password, 255))) {
    return new BadRequestError('Senha inválida');
  }

  if (!(validator.minLength(name, 2) && validator.maxLength(name, 255))) {
    return new BadRequestError('Nome inválida');
  }


  const hasUser = await User.findOne({ email });

  if (hasUser !== undefined) {
    return new BadRequestError('E-mail já em uso');
  }

  const user = await User.create({ name, email, password }).save();


  return user.generateToken();
};


export { login, register };
