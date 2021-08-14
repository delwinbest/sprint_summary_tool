import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 201 on successful signup', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password', name: 'Full Name' })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'bademail.com', password: 'password', name: 'Full Name' })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'nul', name: 'Full Name' })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com' })
    .expect(400);
  await request(app)
    .post('/api/users/signup')
    .send({ password: 'password' })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password', name: 'Full Name' })
    .expect(201);
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password', name: 'Full Name' })
    .expect(400);
});

it('sets a cookie after succesful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password', name: 'Full Name' })
    .expect(201);
  expect(response.get('Set-Cookie')).toBeDefined();
});

it('publishes an event', async () => {
  const title = 'Title';
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password', name: 'Full Name' })
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
