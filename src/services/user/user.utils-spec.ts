import faker from 'faker';
import { Validator } from 'class-validator';


interface UserFactory { name: string; email: string; password: string }
interface UserOptions { name?: string; email?: string; password?: string }

const validator = new Validator();

const emailValid = (email: string): string => {
  if (validator.isEmail(email)) return email;
  return emailValid(faker.internet.email());
};


export const UserFactory = (options?: UserOptions): UserFactory => {
  const email = emailValid(faker.internet.email());

  if (options === undefined) {
    return {
      name: faker.name.findName(),
      email,
      password: faker.internet.password(),
    };
  }
  return {
    name: options.name || faker.name.findName(),
    email: options.email || email,
    password: options.password || faker.internet.password(),
  };
};
