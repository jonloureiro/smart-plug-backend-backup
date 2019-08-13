import { createConnection, getConnection } from 'typeorm';
import request from 'supertest';
import server from '../../server';
import { config } from '../../database';
import { UserEntity, UserFactory } from '../user';
import { ResidenceEntity, ResidenceFactory } from '../residence';
import { McuFactory, McuEntity } from '.';


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
  describe('Creation MCU', (): void => {
    it('should register a mcu when request post /mcus', async (): Promise<void> => {
      const user = await UserEntity.create(UserFactory()).save();
      await ResidenceEntity.create(ResidenceFactory({ admin: user })).save();
      await user.reload();
      const { status, body } = await request(server)
        .post('/mcus')
        .set('Cookie', [`token=${user.generateToken()}`])
        .send(McuFactory());
      expect(status).toEqual(201);
      expect(body).toHaveProperty('data');
      const { data } = body;
      expect(data).toHaveProperty('mac');
    });
  });

  describe('Listing MCU', (): void => {
    it('should return a mcu list when request get /mcu', async (): Promise<void> => {
      const user = await UserEntity.create(UserFactory()).save();
      const residence = await ResidenceEntity.create(ResidenceFactory({ admin: user })).save();
      await user.reload();
      await McuEntity.create({ ...McuFactory(), residence }).save();
      await McuEntity.create({ ...McuFactory(), residence }).save();
      const { status, body } = await request(server)
        .get('/mcus')
        .set('Cookie', [`token=${user.generateToken()}`]);
      expect(status).toEqual(200);
      expect(body).toHaveProperty('data');
      const { data } = body;
      expect(data).toHaveLength(2);
    });
  });
});
