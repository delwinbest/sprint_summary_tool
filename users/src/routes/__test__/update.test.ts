import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/user';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';
import { HttpStatusCode } from '@sprintsummarytool/common';
import { signin } from '../../test/signin';

it('returns a 401 if not signed in', async () => {
  const { cookie, user } = await signin();
  await request(app)
    .put(`/api/users/${user.id}`)
    .send({ email: 'test@test.com', password: 'password', name: 'Full Name' })
    .expect(HttpStatusCode.UNAUTHORIZED);
});

it('returns a 401 if trying to edit another user', async () => {
  const user02 = User.build({
    name: 'Other User',
    password: 'PASSWORD',
    email: 'user02.test.com',
  });
  await user02.save();
  const { cookie, user } = await signin();
  await request(app)
    .put(`/api/users/${user02.id}`)
    .set('Cookie', cookie)
    .send({ email: 'test@test.com', password: 'password', name: 'Full Name' })
    .expect(HttpStatusCode.UNAUTHORIZED);
});

it('returns a 400 with an invalid email', async () => {
  const { cookie, user } = await signin();
  await request(app)
    .put(`/api/users/${user.id}`)
    .set('Cookie', cookie)
    .send({ email: 'bademail.com', password: 'password', name: 'Full Name' })
    .expect(HttpStatusCode.BAD_REQUEST);
});

it('returns a 400 with an invalid password', async () => {
  const { cookie, user } = await signin();
  await request(app)
    .put(`/api/users/${user.id}`)
    .set('Cookie', cookie)
    .send({ email: 'test@test.com', password: 'nul', name: 'Full Name' })
    .expect(HttpStatusCode.BAD_REQUEST);
});

it('sets a cookie after succesful update', async () => {
  const { cookie, user } = await signin();
  const response = await request(app)
    .put(`/api/users/${user.id}`)
    .set('Cookie', cookie)
    .send({
      email: 'test@test.com',
      password: 'NewPassword',
      name: 'Full Name',
    })
    .expect(HttpStatusCode.OK);
  expect(response.get('Set-Cookie')).toBeDefined();
});

it('publishes an event', async () => {
  const { cookie, user } = await signin();
  const response = await request(app)
    .put(`/api/users/${user.id}`)
    .set('Cookie', cookie)
    .send({
      email: 'test@test.com',
      password: 'NewPassword',
      name: 'Full Name',
    })
    .expect(HttpStatusCode.OK);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
