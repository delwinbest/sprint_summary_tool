import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/user';
import { natsWrapper } from '../../nats-wrapper';
import { HttpStatusCode } from '@sprintsummarytool/common';
import { signin } from '../../test/signin';
import { UserStatus } from '@sprintsummarytool/common/build/events/types/user-status';
import { UserRole } from '@sprintsummarytool/common/build/events/types/user-role';

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
    status: UserStatus.Active,
    role: UserRole.User,
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

it('only a user can edit their own details, except role', async () => {
  const { cookie: adminCookie, user: adminUser } = await signin();
  const { cookie, user } = await signin('user@test.com');
  await request(app)
    .put(`/api/users/${user.id}`)
    .set('Cookie', cookie)
    .send({
      email: 'test@test.com',
      password: 'NewPassword',
      name: 'Full Name',
    })
    .expect(HttpStatusCode.OK);
});

it('standard user cannot edit their role', async () => {
  const { cookie: adminCookie, user: adminUser } = await signin();
  const { cookie, user } = await signin('user@test.com');
  await request(app)
    .put(`/api/users/${user.id}`)
    .set('Cookie', cookie)
    .send({
      email: 'test@test.com',
      password: 'NewPassword',
      name: 'Full Name',
      role: UserRole.Admin,
    })
    .expect(HttpStatusCode.UNAUTHORIZED);
});

it('only Admin user can edit role and status', async () => {
  const { cookie: adminCookie, user: adminUser } = await signin();
  const { cookie, user } = await signin('user@test.com');
  await request(app)
    .put(`/api/users/${user.id}`)
    .set('Cookie', cookie)
    .send({
      email: 'test@test.com',
      password: 'NewPassword',
      name: 'Full Name',
      role: UserRole.Admin,
    })
    .expect(HttpStatusCode.UNAUTHORIZED);
  await request(app)
    .put(`/api/users/${user.id}`)
    .set('Cookie', adminCookie)
    .send({
      email: 'test@test.com',
      password: 'NewPassword',
      name: 'Full Name',
      role: UserRole.Admin,
    })
    .expect(HttpStatusCode.OK);
});

it('publishes an event', async () => {
  const { cookie, user } = await signin();
  await request(app)
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
