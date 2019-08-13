import { createConnection, getConnection } from 'typeorm';
import request from 'supertest';
import server from '../../server';
import { config } from '../../database';
import { UserEntity, UserFactory } from '../user';
import { ResidenceEntity, ResidenceFactory } from '../residence';


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
      const { status } = await request(server)
        .post('/mcus')
        .set('Cookie', [`token=${user.generateToken()}`])
        .send({ name: 'testando', mac: `${Math.random().toString().substring(3)}` });
      expect(status).toEqual(201);
    });
  });
});
