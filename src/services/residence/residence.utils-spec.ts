import faker from 'faker';
import { UserEntity } from '../user';


interface ResidenceFactory {
  name: string;
  admin: UserEntity;
}

interface ResidenceOptions {
  name?: string;
  admin: UserEntity;
}


export const ResidenceFactory = (options: ResidenceOptions): ResidenceFactory => ({
  name: options.name || faker.lorem.word().toLowerCase(),
  admin: options.admin,
});
