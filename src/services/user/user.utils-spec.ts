import faker from 'faker';

interface UserFactory { name: string; email: string; password: string }
interface UserOptions { name?: string; email?: string; password?: string }

export const UserFactory = (options?: UserOptions): UserFactory => {
  if (options === undefined) {
    return {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  }
  return {
    name: options.name || faker.name.findName(),
    email: options.email || faker.internet.email(),
    password: options.password || faker.internet.password(),
  };
};
