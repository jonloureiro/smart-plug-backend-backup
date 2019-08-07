import { createConnection, getConnection } from 'typeorm';
import request from 'supertest';
import server from '../../server';
import { config } from '../../database';
import { UserFactory } from '../user/user.utils-spec';
import User from '../user/user.entity';


let token = '';


beforeAll(async (): Promise<void> => {
  await createConnection(config);
  const user = await User.create(UserFactory()).save();
  token = user.generateToken();
});


afterAll(async (): Promise<void> => {
  await getConnection()
    .query('DELETE FROM "user"');
  token = '';
  await getConnection().close();
});


describe('Integration', (): void => {
  it('should receive a list with 10 residences when request /residences', async (): Promise<void> => {
    const { status, body } = await request(server).get('/residences').set('Cookie', [`token=${token}`]);
    expect(status).toEqual(200);
    expect(body).toHaveProperty('residences');
  });
});


describe('Units', (): void => {

});
