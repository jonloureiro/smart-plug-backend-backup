import faker from 'faker';
import { Validator } from 'class-validator';
import { UserEntity } from '../user';


interface ResidenceFactory {
  name: string;
  admin: UserEntity;
}

interface ResidenceOptions {
  name?: string;
  admin: UserEntity;
}

const validator = new Validator();

const nameValid = (): string => {
  const name = faker.lorem.words(10).substr(0, 36).toLowerCase();
  if (validator.maxLength(name, 50)) return name;
  return nameValid();
};

export const ResidenceFactory = (options: ResidenceOptions): ResidenceFactory => ({
  name: options.name || nameValid(),
  admin: options.admin,
});
