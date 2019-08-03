import { createConnection, getConnection } from 'typeorm';
import request from 'supertest';
import { UserFactory } from './user.utils';
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
      const userFactory = UserFactory();
      const response = await request(server).post('/auth/register').send(userFactory);
      expect(response.status).toBe(201);
    });
  });

  describe('Login', (): void => {
    it('should login when credentials valid', async (): Promise<void> => {
      const userFactory = UserFactory();
      await User.create(userFactory).save();
      const { status } = await request(server).post('/auth/login').send(userFactory);
      expect(status).toBe(200);
    });

    it('should not login when credentials invalid', async (): Promise<void> => {
      const userFactory = UserFactory();
      await User.create(userFactory).save();
      userFactory.password = '123456';
      const { status } = await request(server).post('/auth/login').send(userFactory);
      expect(status).toBe(400);
    });
  });
});


describe('Units', (): void => {
  it('should encrypt user password', async (): Promise<void> => {
    const userFactory = UserFactory({ password: '123456' });
    const user = await User.create(userFactory).save();
    expect(user.password).not.toBe('123456');
    const decrypted = await user.checkPassword('123456');
    expect(decrypted).toEqual(true);
  });
});
