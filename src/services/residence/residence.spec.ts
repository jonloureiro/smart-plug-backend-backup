import { createConnection, getConnection } from 'typeorm';
import request from 'supertest';
import server from '../../server';
import { config } from '../../database';
import { UserEntity, UserFactory } from '../user';


let token = '';


beforeAll(async (): Promise<void> => {
  try {
    await createConnection(config);
  } catch (e) {
    const connection = getConnection();
    await connection.connect();
    await connection.synchronize();
  }
});

afterAll(async (): Promise<void> => {
  await getConnection().close();
});

beforeEach(async (): Promise<void> => {
  await getConnection().synchronize();
  const user = await UserEntity.create(UserFactory()).save();
  token = user.generateToken();
});

afterEach(async (): Promise<void> => {
  await getConnection()
    .query('DELETE FROM "user"');
  token = '';
});


describe('Integration', (): void => {
  it('should create a residence when an user without residence to request POST /residences', async (): Promise<void> => {
    const { status } = await request(server).post('/residences').set('Cookie', [`token=${token}`]);
    expect(status).toEqual(201);
  });
});


describe('Units', (): void => {

});
