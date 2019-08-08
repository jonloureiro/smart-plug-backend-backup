import faker from 'faker';
import { Validator } from 'class-validator';
import { UserEntity } from '../user';


interface ResidenceFactory {
  name: string;
  users: UserEntity[];
}

interface ResidenceOptions {
  name?: string;
  admin: UserEntity;
}

const validator = new Validator();

export const ResidenceName = (): string => {
  const name = faker.lorem.words(10).substr(0, 36).toLowerCase();
  if (validator.maxLength(name, 50)) return name;
  return ResidenceName();
};

export const ResidenceFactory = (options: ResidenceOptions): ResidenceFactory => ({
  name: options.name || ResidenceName(),
  users: [options.admin],
});
