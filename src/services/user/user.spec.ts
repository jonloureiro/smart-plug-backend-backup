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

    it('should receive jwt when login with sucess', async (): Promise<void> => {
      const userFactory = UserFactory();
      const user = await User.create(userFactory).save();
      const { header } = await request(server).post('/auth/login').send(userFactory);
      expect(header).toHaveProperty('set-cookie');
      const token = header['set-cookie'][0].split('=')[1].split(';')[0];
      const decoded = user.checkToken(token);
      expect(decoded).toHaveProperty('id');
    });

    it('should to access private route when authenticated', async (): Promise<void> => {
      const userFactory = UserFactory();
      const user = await User.create(userFactory).save();
      const token = user.generateToken();
      const { status } = await request(server).get('/auth/private').set('Cookie', [`token=${token}`]);
      expect(status).toBe(200);
    });

    it('should not to access private route when not authenticated', async (): Promise<void> => {
      const { status } = await request(server).get('/auth/private');
      expect(status).toBe(401);
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

  it('should generate user token', async (): Promise<void> => {
    const user = await User.create(UserFactory()).save();
    const token = user.generateToken();
    const decoded = user.checkToken(token);
    expect(decoded).toHaveProperty('id');
  });
});
