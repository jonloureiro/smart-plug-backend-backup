import { createConnection, getConnection } from 'typeorm';
import request from 'supertest';
import server from '../../server';
import { config } from '../../database';

beforeAll(async (): Promise<void> => {
  await createConnection(config);
});

afterAll(async (): Promise<void> => {
  await getConnection().close();
});

describe('Integration', (): void => {
  describe('Register', (): void => {
    it('should register new account if email not repeated ', async (): Promise<void> => {
      const user = {
        name: 'Jonathan',
        email: 'me@jonloureiro.dev',
        pass: '123456',
      };

      const response = await request(server).post('/auth/register').send(user);
      expect(response.status).toBe(201);
    });
  });

  describe('Login', (): void => {
  });
});


describe('Units', (): void => {

});
