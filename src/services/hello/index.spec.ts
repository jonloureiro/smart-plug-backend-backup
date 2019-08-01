import request from 'supertest';
import server from '../../server';


describe('hello', (): void => {
  it('should return \'hello :name\' when request GET /helo/:name',
    async (): Promise<void> => {
      const { text } = await request(server).get('/hello/jonathan');
      expect(text).toEqual('hello jonathan');
    });
});
