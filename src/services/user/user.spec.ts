import { createConnection, getConnection } from 'typeorm';
import request from 'supertest';
import { UserFactory } from './user.utils-spec';
import server from '../../server';
import { config } from '../../database';
import { UserEntity } from './index';


beforeAll(async (): Promise<void> => {
  await createConnection(config);
});


afterAll(async (): Promise<void> => {
  await getConnection().close();
});


afterEach(async (): Promise<void> => {
  await getConnection().synchronize(true);
});


describe('Integration', (): void => {
  describe('Register', (): void => {
    it('should register new account when data validate', async (): Promise<void> => {
      const { status } = await request(server).post('/auth/register').send(UserFactory());
      expect(status).toEqual(201);
    });

    it('should not register new account when email repeated', async (): Promise<void> => {
      const user = await UserEntity.create(UserFactory()).save();
      const { status, body } = await request(server).post('/auth/register').send(user);
      expect(status).toEqual(400);
      expect(body.message).toBe('E-mail já em uso');
    });

    it('should receive jwt when register with sucess', async (): Promise<void> => {
      const { status, header } = await request(server).post('/auth/register').send(UserFactory());
      expect(status).toEqual(201);
      expect(header).toHaveProperty('set-cookie');
      const token = header['set-cookie'][0].split('=')[1].split(';')[0];
      const decoded = UserEntity.checkToken(token);
      expect(decoded).toHaveProperty('id');
    });

    it('should not register when password is small', async (): Promise<void> => {
      const userFactory = UserFactory({ password: '12345' });
      const { status, body } = await request(server).post('/auth/register').send(userFactory);
      expect(status).toEqual(400);
      expect(body.message).toBe('Senha inválida');
    });

    it('should not register when email invalid', async (): Promise<void> => {
      const userFactory = UserFactory({ email: 'me@jonloureiro' });
      const { status, body } = await request(server).post('/auth/register').send(userFactory);
      expect(status).toEqual(400);
      expect(body.message).toBe('E-mail inválida');
    });

    it('should not register when name invalid', async (): Promise<void> => {
      const userFactory = UserFactory({ name: 'a' });
      const { status, body } = await request(server).post('/auth/register').send(userFactory);
      expect(status).toEqual(400);
      expect(body.message).toBe('Nome inválida');
    });

    it('should return Bad Request when body request not exist', async (): Promise<void> => {
      const { status } = await request(server).post('/auth/register');
      expect(status).toEqual(400);
    });
  });


  describe('Login', (): void => {
    it('should login when credentials valid', async (): Promise<void> => {
      const userFactory = UserFactory();
      await UserEntity.create(userFactory).save();
      const { status } = await request(server).post('/auth/login').send(userFactory);
      expect(status).toEqual(200);
    });

    it('should not login when password invalid', async (): Promise<void> => {
      const userFactory = UserFactory();
      await UserEntity.create(userFactory).save();
      userFactory.password = '123456';
      const { status, body } = await request(server).post('/auth/login').send(userFactory);
      expect(status).toEqual(400);
      expect(body.message).toBe('E-mail e/ou senha estão errados');
    });

    it('should not login when password is small', async (): Promise<void> => {
      const userFactory = UserFactory();
      await UserEntity.create(userFactory).save();
      userFactory.password = '1234';
      const { status, body } = await request(server).post('/auth/login').send(userFactory);
      expect(status).toEqual(400);
      expect(body.message).toBe('Senha inválida');
    });

    it('should not login when email invalid', async (): Promise<void> => {
      const userFactory = UserFactory();
      await UserEntity.create(userFactory).save();
      userFactory.email = 'me@jonloureiro';
      const { status, body } = await request(server).post('/auth/login').send(userFactory);
      expect(status).toEqual(400);
      expect(body.message).toBe('E-mail inválida');
    });

    it('should not login when email nonexistent', async (): Promise<void> => {
      const userFactory = UserFactory();
      await UserEntity.create(userFactory).save();
      userFactory.email = 'me@jonloureiro.dev';
      const { status, body } = await request(server).post('/auth/login').send(userFactory);
      expect(status).toEqual(400);
      expect(body.message).toBe('E-mail não cadastrado');
    });

    it('should receive jwt when login with sucess', async (): Promise<void> => {
      const userFactory = UserFactory();
      await UserEntity.create(userFactory).save();
      const { status, header } = await request(server).post('/auth/login').send(userFactory);
      expect(status).toEqual(200);
      expect(header).toHaveProperty('set-cookie');
      const token = header['set-cookie'][0].split('=')[1].split(';')[0];
      const decoded = UserEntity.checkToken(token);
      expect(decoded).toHaveProperty('id');
    });

    it('should to access private route when authenticated', async (): Promise<void> => {
      const userFactory = UserFactory();
      const user = await UserEntity.create(userFactory).save();
      const token = user.generateToken();
      const { status } = await request(server).get('/auth/private').set('Cookie', [`token=${token}`]);
      expect(status).toEqual(200);
    });

    it('should not to access private route when not authenticated', async (): Promise<void> => {
      const { status, body } = await request(server).get('/auth/private');
      expect(status).toEqual(401);
      expect(body.message).toBe('Acesso negado');
    });

    it('should not to access private route when token invalid', async (): Promise<void> => {
      const { status, body } = await request(server).get('/auth/private').set('Cookie', ['token=mytoken']);
      expect(status).toEqual(401);
      expect(body.message).toBe('Acesso negado');
    });

    it('should set-cookie empty when access private route with token invalid', async (): Promise<void> => {
      const { status, header } = await request(server).get('/auth/private').set('Cookie', ['token=mytoken']);
      expect(status).toEqual(401);
      expect(header).toHaveProperty('set-cookie');
      const token = header['set-cookie'][0].split('=')[1].split(';')[0];
      expect(token).toBe('');
    });

    it('should return Bad Request when body request not exist', async (): Promise<void> => {
      const { status } = await request(server).post('/auth/login');
      expect(status).toEqual(400);
    });
  });


  describe('Logout', (): void => {
    it('should set-cookie empty when access /auth/logout', async (): Promise<void> => {
      const loginRes = await request(server).post('/auth/logout').send(UserFactory());
      expect(loginRes.status).toEqual(200);
      expect(loginRes.header).toHaveProperty('set-cookie');
      const token = loginRes.header['set-cookie'][0].split('=')[1].split(';')[0];
      const logoutRes = await request(server).post('/auth/logout').set('Cookie', [`token=${token}`]);
      expect(logoutRes.status).toEqual(200);
      expect(logoutRes.header).toHaveProperty('set-cookie');
      const tokenEmpty = logoutRes.header['set-cookie'][0].split('=')[1].split(';')[0];
      expect(tokenEmpty).toBe('');
    });
  });
});


describe('Units', (): void => {
  it('should encrypt user password', async (): Promise<void> => {
    const userFactory = UserFactory({ password: '123456' });
    const user = await UserEntity.create(userFactory).save();
    expect(user.password).not.toBe('123456');
    const decrypted = await user.checkPassword('123456');
    expect(decrypted).toEqual(true);
  });

  it('should generate user token', async (): Promise<void> => {
    const user = await UserEntity.create(UserFactory()).save();
    const token = user.generateToken();
    const decoded = UserEntity.checkToken(token);
    expect(decoded).toHaveProperty('id');
  });

  it('should invalidate user token', async (): Promise<void> => {
    const user = await UserEntity.create(UserFactory()).save();
    const token = `${user.generateToken()}2`;
    const decoded = UserEntity.checkToken(token);
    expect(decoded).toBe('Acesso negado');
  });
});
