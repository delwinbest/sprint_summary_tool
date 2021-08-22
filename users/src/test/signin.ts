import request from 'supertest';
import { app } from '../app';

export const signin = async (email = 'test@test.com') => {
  const password = 'password';
  const name = 'Name';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
      name,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');
  const user = response.body;
  return { cookie, user };
};
