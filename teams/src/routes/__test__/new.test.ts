import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/signin';
import { Team } from '../../models/team';

import { natsWrapper } from '../../nats-wrapper';
import { HttpStatusCode } from '@sprintsummarytool/common';

it('has a route handler listening to /api/teams for post requests', async () => {
  const response = await request(app).post('/api/teams').send({});
  expect(response.status).not.toEqual(HttpStatusCode.NOT_FOUND);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .post('/api/teams')
    .send({})
    .expect(HttpStatusCode.UNAUTHORIZED);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/teams')
    .set('Cookie', signin())
    .send({});
  expect(response.status).not.toEqual(HttpStatusCode.UNAUTHORIZED);
});

it('saves a team to the database with version number 0', async () => {
  const requestData = {
    name: 'Team 01',
  };

  const response = await request(app)
    .post('/api/teams')
    .set('Cookie', signin())
    .send(requestData)
    .expect(HttpStatusCode.CREATED);
  const newTeam = await Team.findById(response.body.id);
  expect(newTeam).toBeDefined();
  expect(newTeam!.version).toEqual(0);
});

it('emits an team created event', async () => {
  const requestData = {
    name: 'Team 01',
  };

  const response = await request(app)
    .post('/api/teams')
    .set('Cookie', signin())
    .send(requestData)
    .expect(HttpStatusCode.CREATED);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
