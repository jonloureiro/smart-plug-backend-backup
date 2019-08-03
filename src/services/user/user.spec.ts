import { createConnection, getConnection } from 'typeorm';
import request from 'supertest';
import { compare } from 'bcrypt';
import { name, internet } from 'faker';
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
    it('should register new account when email not repeated', async (): Promise<void> => {
      const user = {
        name: name.findName(),
        email: internet.email(),
        password: internet.password(),
      };

      const response = await request(server).post('/auth/register').send(user);
      expect(response.status).toBe(201);
    });
  });

  describe('Login', (): void => {
    it('should login when credentials valid', async (): Promise<void> => {
      const user = {
        name: name.findName(),
        email: internet.email(),
        password: internet.password(),
      };

      await User.create(user).save();

      const { status } = await request(server).post('/auth/login').send(user);
      expect(status).toBe(200);
    });

    it('should not login when credentials invalid', async (): Promise<void> => {
      const user = {
        name: name.findName(),
        email: internet.email(),
        password: internet.password(),
      };

      await User.create(user).save();

      user.password = '123456';

      const { status } = await request(server).post('/auth/login').send(user);
      expect(status).toBe(400);
    });
  });
});


describe('Units', (): void => {
  it('should encrypt user password', async (): Promise<void> => {
    const user = await User.create({
      name: name.findName(),
      email: internet.email(),
      password: '123456',
    }).save();

    expect(user.password).not.toBe('123456');

    const decrypted = await compare('123456', user.password);

    expect(decrypted).toEqual(true);
  });
});
