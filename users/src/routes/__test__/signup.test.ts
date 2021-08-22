import { UserRole } from '@sprintsummarytool/common/build/events/types/user-role';
import { UserStatus } from '@sprintsummarytool/common/build/events/types/user-status';
import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/user';
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

it('sets user status as active if new user', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password', name: 'Full Name' })
    .expect(201);
  const newUser = await User.findById(response.body.id);
  expect(newUser!.status).toEqual(UserStatus.Active);
});

it('sets user role as Admin if first user', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password', name: 'Full Name' })
    .expect(201);
  const newUser = await User.findById(response.body.id);
  expect(newUser!.role).toEqual(UserRole.Admin);
});

it('sets user role as User if NOT first user', async () => {
  const user01 = await request(app)
    .post('/api/users/signup')
    .send({ email: 'user01@test.com', password: 'password', name: 'Full Name' })
    .expect(201);
  const user02 = await request(app)
    .post('/api/users/signup')
    .send({ email: 'user02@test.com', password: 'password', name: 'Full Name' })
    .expect(201);
  const newUser = await User.findById(user02.body.id);
  expect(newUser!.role).toEqual(UserRole.User);
});

it('sets a cookie after succesful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password', name: 'Full Name' })
    .expect(201);
  expect(response.get('Set-Cookie')).toBeDefined();
});

it('publishes an event', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password', name: 'Full Name' })
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
