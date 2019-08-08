import { createConnection, getConnection } from 'typeorm';
import request from 'supertest';
import server from '../../server';
import { config } from '../../database';
import { UserEntity, UserFactory } from '../user';
import { ResidenceEntity, ResidenceFactory, ResidenceName } from './index';


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


afterEach(async (): Promise<void> => {
  await getConnection()
    .query('DELETE FROM "user"');
});


describe('Integration', (): void => {
  it('should create a residence when an user without residence to request POST /residences', async (): Promise<void> => {
    const user = await UserEntity.create(UserFactory()).save();
    const residenceFactory = { name: ResidenceName() };
    const { status, body } = await request(server)
      .post('/residences')
      .set('Cookie', [`token=${user.generateToken()}`])
      .send(residenceFactory);

    expect(status).toEqual(201);
    expect(body).toHaveProperty('data');
    const name = body.data.name.split('#')[0];
    expect(name).toBe(residenceFactory.name.replace(/(^[\s]+|[\s]+$)/g, ''));
  });

  it('should return bad request when body request is empty', async (): Promise<void> => {
    const user = await UserEntity.create(UserFactory()).save();
    const { status } = await request(server).post('/residences').set('Cookie', [`token=${user.generateToken()}`]);
    expect(status).toEqual(400);
  });

  it('should return Unauthorized Error when token not exist', async (): Promise<void> => {
    const { status } = await request(server).post('/residences').set('Cookie', ['token=']);
    expect(status).toEqual(401);
  });

  it('should return admin when create a residence', async (): Promise<void> => {
    const user = await UserEntity.create(UserFactory()).save();
    const { body } = await request(server)
      .post('/residences')
      .set('Cookie', [`token=${user.generateToken()}`])
      .send({ name: ResidenceName() });

    expect(body).toHaveProperty('data');
    const { data } = body;
    expect(data).toHaveProperty('users');
  });
});


describe('Units', (): void => {
  it('should generate a hash in residence name', async (): Promise<void> => {
    const user = await UserEntity.create(UserFactory()).save();
    const residenceFactory = ResidenceFactory({ admin: user });
    const { name } = await ResidenceEntity.create(residenceFactory).save();
    expect(name).not.toBe(residenceFactory.name);
    const hash = name.split('#')[1];
    expect(hash).toHaveLength(4);
  });

  it('should remove whitespace in residence name', async (): Promise<void> => {
    const residenceFactory = ResidenceFactory({
      name: `${ResidenceName()} `,
      admin: await UserEntity.create(UserFactory()).save(),
    });
    const residence = await ResidenceEntity.create(residenceFactory).save();
    const name = residence.name.split('#')[0];
    expect(name).not.toBe(residenceFactory.name);
    expect(name).toBe(residenceFactory.name.replace(/(^[\s]+|[\s]+$)/g, ''));
  });
});
