import { createConnection, getConnection } from 'typeorm';
import request from 'supertest';
import server from '../../server';
import { config } from '../../database';
import { UserEntity, UserFactory } from '../user';
import { ResidenceEntity, ResidenceFactory } from './index';


let user: UserEntity;


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
  user = await UserEntity.create(UserFactory()).save();
});


afterEach(async (): Promise<void> => {
  await getConnection()
    .query('DELETE FROM "user"');
});


describe('Integration', (): void => {
  it.skip('should create a residence when an user without residence to request POST /residences', async (): Promise<void> => {
    const { status, body } = await request(server).post('/residences').set('Cookie', [`token=${user.generateToken()}`]);
    expect(status).toEqual(201);
    expect(body).toHaveProperty('data');
    const { data } = body;
    expect(data).toHaveProperty('id').toHaveProperty('name');
  });
});


describe('Units', (): void => {
  it('should generate a hash in residence name', async (): Promise<void> => {
    const residenceFactory = ResidenceFactory({ admin: user });
    const residence = await ResidenceEntity.create(residenceFactory).save();
    expect(residence.name).not.toBe(residenceFactory.name);
    const hash = residence.name.split('#')[1];
    expect(hash).toHaveLength(4);
  });
});
