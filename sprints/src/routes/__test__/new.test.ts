import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/signin';
import { Sprint, SprintStatus } from '../../models/sprint';

import { natsWrapper } from '../../nats-wrapper';
import { HttpStatusCode } from '@sprintsummarytool/common';

it('has a route handler listening to /api/sprints for post requests', async () => {
  const response = await request(app).post('/api/sprints').send({});
  expect(response.status).not.toEqual(HttpStatusCode.NOT_FOUND);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .post('/api/sprints')
    .send({})
    .expect(HttpStatusCode.UNAUTHORIZED);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/sprints')
    .set('Cookie', signin())
    .send({});
  expect(response.status).not.toEqual(HttpStatusCode.UNAUTHORIZED);
});

it('saves a sprint to the database with version number 0', async () => {
  const requestData = {
    name: 'Sprint 01',
    duration: 10,
    startDate: '2021-12-31',
  };

  const response = await request(app)
    .post('/api/sprints')
    .set('Cookie', signin())
    .send(requestData)
    .expect(HttpStatusCode.CREATED);
  const newSprint = await Sprint.findById(response.body.id);
  expect(newSprint).toBeDefined();
  expect(newSprint!.version).toEqual(0);
  expect(newSprint!.status).toStrictEqual(SprintStatus.Active);
});

it('emits an sprint created event', async () => {
  const requestData = {
    name: 'Sprint 01',
    duration: 10,
    startDate: '2021-12-31',
  };

  const response = await request(app)
    .post('/api/sprints')
    .set('Cookie', signin())
    .send(requestData)
    .expect(HttpStatusCode.CREATED);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
