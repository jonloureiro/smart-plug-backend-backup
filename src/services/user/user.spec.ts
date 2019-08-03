import { createConnection, getConnection } from 'typeorm';
import request from 'supertest';
import { compare } from 'bcrypt';
import server from '../../server';
import { config } from '../../database';
import User from './user.entity';


beforeAll(async (): Promise<void> => {
  await createConnection(config);
});


afterAll(async (): Promise<void> => {
  await getConnection().close();
});


beforeEach(async (): Promise<void> => {
  await getConnection()
    .createQueryBuilder()
    .delete().from(User);
});


describe('Integration', (): void => {
  describe('Register', (): void => {
    it('should register new account if email not repeated', async (): Promise<void> => {
      const user = {
        name: 'Jonathan',
        email: 'me@jonloureiro.dev',
        password: '123456',
      };

      const response = await request(server).post('/auth/register').send(user);
      expect(response.status).toBe(201);
    });
  });

  describe('Login', (): void => {
  });
});


describe('Units', (): void => {
  it('should encrypt user password', async (): Promise<void> => {
    const user = await User.create({
      name: 'Jonathan',
      email: 'me@jonloureiro.dev',
      password: '123456',
    }).save();

    expect(user.password).not.toBe('123456');

    const decrypted = await compare('123456', user.password);

    expect(decrypted).toEqual(true);
  });
});
